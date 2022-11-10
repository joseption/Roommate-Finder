import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAuthenticated } from '../../middleware';

const prisma = new PrismaClient();

const router = require('express').Router();

// listings REST API everything is under /listings
// create listing
router.post('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    // authentication should be added as middleware

    // how are we handling authentication and extracting userId
    const listing = await prisma.listings.create({
      data: {
        name: req.body.name,
        images: req.body.images,
        city: req.body.city,
        housing_type: req.body.housing_type,
        description: req.body.description,
        price: req.body.price,
        petsAllowed: req.body.petsAllowed,
        userId: 'to be decided after auth works',
        address: req.body.address || undefined, // address is optional
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
