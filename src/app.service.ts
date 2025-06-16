import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as soap from 'soap';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './entities/payment.entity';

@Injectable()
export class AppService {
  private readonly wsdlUrl =
    'https://sep.shaparak.ir/PaymentsGateway/InitPayment.asmx?WSDL';
  private readonly verifyUrl =
    'https://sep.shaparak.ir/PaymentsGateway/VerifyPayment.asmx?WSDL';
  private readonly merchantCode = '';

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  // recieving token
  async requestPayment(amount: number, orderId: string, callbackUrl: string) {
    const data = {
      Amount: amount,
      MerchantCode: this.merchantCode,
      InvoiceNumber: orderId,
      RedirectAddress: callbackUrl,
    };

    try {
      const client = await soap.createClientAsync(this.wsdlUrl);
      const [result] = await client.RequestTokenAsync(data);
      const token = result.RequestTokenResult;

      if (!token) {
        throw new InternalServerErrorException('Invalid token');
      }

      await this.paymentModel.create({
        orderId,
        amount,
        token,
        status: 'pending',
      });

      return token;
    } catch (error) {
      console.error('Payment request failed', error);
      throw new InternalServerErrorException('Failed to initiate payment');
    }
  }

  //2api Verify Payment and save to dtatbase

  async verifyPayment(token: string, referenceNumber: string) {
    const data = {
      MerchantCode: this.merchantCode,
      Token: token,
    };

    try {
      const data = {
        MerchantCode: this.merchantCode,
        Token: token,
      };


      
    } catch (error) {}
  }
}
