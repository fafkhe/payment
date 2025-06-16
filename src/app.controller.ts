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
  ) {}

  @Get('/')
  async requestPayment(
    @Query('amount') amount: string,
    @Query('orderId') orderId: string,
    @Query('callbackUrl') callbackUrl: string,
    @Res() res: Response,
  ) {
    try {
      const amountNumber = Number(amount);

      const token = await this.paymentService.requestPayment(
        amountNumber,
        orderId,
        callbackUrl,
      );
      const paymentUrl = `https://sep.shaparak.ir/PaymentsGateway/Payment.aspx?token=${token}`;
      return res.redirect(paymentUrl);
    } catch (error) {
      console.error(error);
    }
  }

  @Post('callback')
  async paymentCallback(@Req() req: Request, @Res() res: Response) {
    //az bank ferestade mishe: referenceId //
    //statusCode 0:moafagh //

    const { Token, ReferenceId, statusCode } = req.body;

    if (!Token || !ReferenceId || !statusCode) {
      return res.status(400).send('Invalid callback parameters');
    }

    if (statusCode !== '0') {
      return res.status(400).send(`Payment failed with ResCode: ${statusCode}`);
    }

    try {
      await this.paymentService.verifyPayment(Token, ReferenceId);
      return res.send('Payment was successful and verified');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error verifying payment');
    }
  }
}
