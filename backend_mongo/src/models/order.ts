import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging';
import IOrder from '../interfaces/order';

const OrderSchema: Schema = new Schema(
  {
    idClient: { type: Number, required: true },
    idRestaurant: { type: [Schema.Types.ObjectId], required: true },
    idLivreur: { type: Number, required: false },
    menus: { type: [Schema.Types.ObjectId], required: false },
    articles: { type: [Schema.Types.ObjectId], required: false },
    activeCodeSponsorship: { type: Boolean, required: true },
    //state:
  },
  {
    timestamps: true,
  }
);

OrderSchema.post<IOrder>('save', function () {
  logging.info('Mongo', 'Checkout the rrder we just saved: ', this);
});

export default mongoose.model<IOrder>('Order', OrderSchema);
