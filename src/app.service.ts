import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as soap from 'soap';

@Injectable()
export class AppService {
  private readonly wsdlUrl =
    'https://sep.shaparak.ir/PaymentsGateway/InitPayment.asmx?WSDL';
  private readonly verifyUrl =
    'https://sep.shaparak.ir/PaymentsGateway/VerifyPayment.asmx?WSDL';
  private readonly merchantCode = '';

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

      return token;
    } catch (error) {
      console.error('Payment request failed', error);
      throw new InternalServerErrorException('Failed to initiate payment');
    }
  }

  //2api Verify Payment

  async verifyPayment(token: string, referenceNumber: string) {
  const data = {
    MerchantCode: this.merchantCode,
    Token: token,
  };

  try {
   
  } catch (error) {
    
  }
}

}
