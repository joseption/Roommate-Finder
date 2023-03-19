import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAuthenticated } from '../../middleware';
import { uploadImage } from 'utils/uploadImage';

const axios = require('axios');
const prisma = new PrismaClient();
const router = require('express').Router();
const fetch = (url: any, init?: any) => import('node-fetch').then(({default: fetch}) => fetch(url, init));
router.use(isAuthenticated);

// get all listings made by a given user
router.get('/all/:userId', async (req: Request, res: Response) => {
  try {
    const listings = await prisma.listings.findMany({
      where: {
        userId: req.params.userId,
      },
    });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

// Function to validate an address using MapQuest Geocoding API
async function validateAddress(address: string) {
  try {
    const geocodingResponse = await axios.get(
      `https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_API_KEY}`,
      {
        params: {
          location: address,
        },
      }
    );

    const locations = geocodingResponse.data.results[0].locations;

    if (locations && locations.length > 0) {
      const location = locations[0];
      return location.geocodeQualityCode.startsWith('P1');
    }

    return false;
  } catch (error) {
    console.error(`Error validating address: ${error.message}`);
    return false;
  }
}

// listings REST API everything is under /listings
// create listing
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log("endpoint hit");
    const payload: payload = req.body[0];
    const userId = payload.userId;

    const UCF_ADDRESS = 'University of Central Florida, Orlando, FL';
    const {
      name,
      images,
      city,
      housing_type,
      description,
      price,
      petsAllowed,
      address,
      bathrooms,
      rooms,
      size,
      zipcode,
    } = req.body;
    const uploadImages = [];
    const fullAddress = `${address}, ${city}, FL ${zipcode}`;
    if (await validateAddress(fullAddress) === false) {
      return res.status(400).json({ Error: 'Invalid address' });
    }
    const distanceMatrixResponse = await axios.get(
      `https://www.mapquestapi.com/directions/v2/routematrix?key=${process.env.MAPQUEST_API_KEY}`,
      {
        params: {
          from: UCF_ADDRESS,
          to: fullAddress,
        },
      }
    );
    const distanceToUcf = Math.round(distanceMatrixResponse.data.distance[1]);
    if (!name) {
      return res.status(400).json({ Error: 'Name is required' });
    }
    //check if images contains anything
    if (!images || images.length == 0) {
      return res.status(400).json({ Error: 'Images are required' });
    } else {
      //check if images are base64 string
      //upload images to s3 bucket
      //add image urls to uploadImages array
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (!/^data:image\/[a-z]+;base64,/.test(image)) {
          return res.status(400).json({ Error: 'Image should be a base64 image!' });
        }
        const uploadedImage = await uploadImage(image);

        if (!uploadedImage) return res.status(400).json({ Error: 'Failed to upload image' });
        uploadImages.push(uploadedImage);
      }
    }

    if (!city) {
      return res.status(400).json({ Error: 'City is required' });
    }
    if (!housing_type) {
      return res.status(400).json({ Error: 'Housing type is required' });
    }
    if (!description) {
      return res.status(400).json({ Error: 'Description is required' });
    }
    if (!price) {
      return res.status(400).json({ Error: 'Price is required' });
    }
    if (petsAllowed === undefined) {
      return res.status(400).json({ Error: 'Pets allowed is required' });
    }
    if (!address) {
      return res.status(400).json({ Error: 'Address is required' });
    }

    const listing = await prisma.listings.create({
      data: {
        name: name as string,
        images: uploadImages as string[],
        city: city as string,
        housing_type: housing_type as string,
        description: description as string,
        price: price as number,
        petsAllowed: petsAllowed as boolean,
        userId: userId as string,
        address: address as string,
        bathrooms: (bathrooms as number) || undefined,
        rooms: (rooms as number) || undefined,
        size: (size as number) || undefined,
        zipcode: (zipcode as string) || undefined,
        distanceToUcf: distanceToUcf as number,
      },
    });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

// * update a listing
router.put('/:listingId', async (req: Request, res: Response) => {
  try {
    const {
      name,
      images,
      city,
      housing_type,
      description,
      price,
      petsAllowed,
      address,
      bathrooms,
      rooms,
      size,
      zipcode,
      distanceToUcf,
    } = req.body;

    const uploadImages = [];
    //check if images is an array

    //check if images are base64 string
    //upload images to s3 bucket
    //add image urls to uploadImages array
    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (!/^data:image\/[a-z]+;base64,/.test(image)) {
          return res.status(400).json({ Error: 'Image should be a base64 image!' });
        }
        const uploadedImage = await uploadImage(image);

        if (!uploadedImage) return res.status(400).json({ Error: 'Failed to upload image' });
        uploadImages.push(uploadedImage);
      }
    }

    const listing = await prisma.listings.findFirst({
      where: {
        id: req.params.listingId as string,
      },
    });
    uploadImages.push(...listing.images);
    const updatedListing = await prisma.listings.update({
      where: {
        id: req.params.listingId as string,
      },
      data: {
        name: name || undefined,
        images: !images ? listing.images : uploadImages,
        city: city || undefined,
        housing_type: housing_type || undefined,
        description: description || undefined,
        price: price || undefined,
        petsAllowed: petsAllowed || undefined,
        address: address || undefined,
        bathrooms: bathrooms || undefined,
        rooms: rooms || undefined,
        size: size || undefined,
        zipcode: zipcode || undefined,
        distanceToUcf: distanceToUcf || undefined,
      },
    });
    res.status(200).json(updatedListing);
  } catch (err) {
    res.status(500).json({ Error: err.message });
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
router.post('/all', async (req: Request, res: Response) => {
  try {
    const { housing_type, price, petsAllowed, distanceToUcf, rooms, bathrooms, size } = req.body;
    const listings = await prisma.listings.findMany({
      where: {
        housing_type: housing_type || undefined,
        price: price ? { lte: price } : undefined,
        petsAllowed: petsAllowed as boolean,
        distanceToUcf: distanceToUcf ? { lte: distanceToUcf } : undefined,
        rooms: rooms || undefined,
        bathrooms: bathrooms || undefined,
        size: size || undefined,
      },
    });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get favorited listings
router.get('/favorites', async (req: Request, res: Response) => {
  try {
    const payload: payload = req.body[0];
    const userId = payload.userId;
    const favorites = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        favoritedListings: {
          select: {
            id: true,
            name: true,
            images: true,
            city: true,
            housing_type: true,
            description: true,
            price: true,
            petsAllowed: true,
            userId: true,
            address: true,
            bathrooms: true,
            rooms: true,
            size: true,
            zipcode: true,
            distanceToUcf: true,
          },
        },
      },
    });
    // const { favoritedListings } = favorites;
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

router.post('/favorite/:listingId', async (req: Request, res: Response) => {
  try {
    const payload: payload = req.body[0];
    const userId = payload.userId;
    const listingId = req.params.listingId;
    const favorite = await prisma.listings.update({
      where: {
        id: listingId as string,
      },
      data: {
        favoritedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });
    res.status(200).json('successfully favorited');
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

router.post('/unfavorite/:listingId', async (req: Request, res: Response) => {
  try {
    const payload: payload = req.body[0];
    const userId = payload.userId;
    const listingId = req.params.listingId;
    const favorite = await prisma.listings.update({
      where: {
        id: listingId as string,
      },
      data: {
        favoritedBy: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
    res.status(200).json('successfully unfavorited');
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

router.post('/location', async (req: Request, res: Response) => {
  const { address } = req.body;
  if (address) {
    const boundingBox = '24.396308,-81.786088,31.000652,-79.974309'; // bounding box for Florida
    const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_API_KEY}&location=${address}&boundingBox=${boundingBox}`;

    try {
      let response = await fetch(url);
      response = await response.json();
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({Error: err});
    }
  }
  else {
    res.status(500).json({ Error: "No address provided" });
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
