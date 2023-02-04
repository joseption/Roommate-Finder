import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAuthenticated } from '../../middleware';
import { uploadImage } from 'utils/uploadImage';

const prisma = new PrismaClient();

const router = require('express').Router();

// listings REST API everything is under /listings
// create listing
router.post('/', isAuthenticated, async (req: Request, res: Response) => {
  const { name, images, city, housing_type, description, price, petsAllowed, address } = req.body;
  const uploadImages = [];
  if (!name) {
    return res.status(400).json('Name is required');
  }
  //check if images is an array 
  if (!images || !Array.isArray(images)) {
    return res.status(400).json('Images are required');
  }
  else{
      //check if images are base64 string 
    //upload images to s3 bucket
    //add image urls to uploadImages array
    for(let i = 0; i < images.length; i++){
      const image = images[i];
      if(!/^data:image\/[a-z]+;base64,/.test(image)) {
        return res.status(400).json({ Error: 'Image should be a base64 image!' });
      }
      const uploadedImage = await uploadImage(image);
      if(!uploadedImage) return res.status(400).json('Image Upload Failed');
      uploadImages.push(uploadedImage);
    }
  }
  if (!city) {
    return res.status(400).json('City is required');
  }
  if (!housing_type) {
    return res.status(400).json('Housing type is required');
  }
  if (!description) {
    return res.status(400).json('Description is required');
  }
  if (!price) {
    return res.status(400).json('Price is required');
  }
  if (!petsAllowed) {
    return res.status(400).json('Pets allowed is required');
  }
  if (!address) {
    return res.status(400).json('Address is required');
  }
  try {
    // authentication should be added as middleware
    const payload:payload = req.body[0];
    const userId = payload.userId;
    // how are we handling authentication and extracting userId
    const listing = await prisma.listings.create({
      data: {
        name: name,
        images: uploadImages,
        city: city,
        housing_type: housing_type,
        description: description,
        price: price,
        petsAllowed: petsAllowed,
        userId,
        address: address || undefined, // address is optional
      },
    });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json(err);
  }
});

// * update a listing
router.put('/:listingId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const updatedListing = await prisma.listings.update({
      where: {
        id: req.params.listingId,
      },
      data: {
        name: req.body.name || undefined,
        images: req.body.images || undefined,
        city: req.body.city || undefined,
        housing_type: req.body.housing_type || undefined,
        description: req.body.description || undefined,
        price: req.body.price || undefined,
        petsAllowed: req.body.petsAllowed || undefined,
        address: req.body.address || undefined,
      },
    });
    res.status(200).json(updatedListing);
  } catch (err) {
    res.status(500).json(err);
  }
});

// * delete a listing
router.delete('/:listingId', async (req: Request, res: Response) => {
  try {
    await prisma.listings.delete({
      where: {
        id: req.params.listingId,
      },
    });
    res.status(200).json('Succesfully deleted listing');
  } catch (err) {
    res.status(500).json(err);
  }
});

// * get all listings
router.get('/all', async (req: Request, res: Response) => {
  try {
    const listings = await prisma.listings.findMany();
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json(err);
  }
});

// * get one listing
router.get('/:listingId', async (req: Request, res: Response) => {
  try {
    const listing = await prisma.listings.findFirst({
      where: {
        id: req.params.listingId,
      },
    });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
