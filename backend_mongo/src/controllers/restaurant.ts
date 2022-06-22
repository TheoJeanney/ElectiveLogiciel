import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Restaurant from '../models/restaurant';

const createRestaurant = (req: Request, res: Response, next: NextFunction) => {
  const { name, idRestaurateur, menus, address } = req.body;

  const restaurant = new Restaurant({
    _id: new mongoose.Types.ObjectId(),
    name,
    idRestaurateur,
    menus,
    address,
  });

  return restaurant
    .save()
    .then(restaurants => {
      return res.status(201).json({
        restaurant: restaurants,
      });
    })
    .catch(error => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const getAllRestaurants = (req: Request, res: Response, next: NextFunction) => {
  Restaurant.find()
    .exec()
    .then(restaurants => {
      return res.status(200).json({
        restaurants: restaurants,
        count: restaurants.length,
      });
    })
    .catch(error => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

//find one restaurant
const getOneRestaurant = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  Restaurant.findById(id)
    .exec()
    .then(restaurant => {
      if (!restaurant) {
        return res.status(404).json({
          message: 'Restaurant not found',
        });
      }
      return res.status(200).json({
        restaurant: restaurant,
      });
    })
    .catch(error => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

//update one restaurant
const updateRestaurant = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name, idRestaurateur, menus, address } = req.body;

  Restaurant.findByIdAndUpdate(id, {
    name,
    idRestaurateur,
    menus,
    address,
  })
    .exec()
    .then(restaurant => {
      if (!restaurant) {
        return res.status(404).json({
          message: 'Restaurant not found',
        });
      }
      return res.status(200).json({
        message: 'Le restauarant a été mis à jour',
      });
    })
    .catch(error => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

//delete one restaurant
const deleteRestaurant = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  Restaurant.findByIdAndRemove(id)
    .exec()
    .then(restaurant => {
      if (!restaurant) {
        return res.status(404).json({
          message: 'Restaurant not found',
        });
      }
      return res.status(200).json({
        restaurant: restaurant,
      });
    })
    .catch(error => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

export default {
  createRestaurant,
  getAllRestaurants,
  getOneRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
