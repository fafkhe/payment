import { Controller, Get, Query, Res, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './entities/payment.entity';

@Controller('payment')
export class AppController {
  constructor(
    private readonly paymentService: AppService,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) { }

  @Get('/')
  async requestPayment(
    @Query('amount') amount: string,
    @Query('orderId') orderId: string,
    @Query('callbackUrl') callbackUrl: string,
    @Res() res: Response,
  ) {
    try {
      const amountNumber = Number(amount);
   

      const token = await this.paymentService.requestPayment(amountNumber, orderId, callbackUrl);
      const paymentUrl = `https://sep.shaparak.ir/PaymentsGateway/Payment.aspx?token=${token}`;
      return res.redirect(paymentUrl);
    } catch (error) {
      console.error(error);
    }
  }

  @Post('callback')
  async paymentCallback(@Req() req: Request, @Res() res: Response) {
 
  }
  
}
