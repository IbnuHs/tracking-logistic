import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { CreateCustomerServiceDto } from './dto/create-customer-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from './entities/customer-service.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomerServiceService {
  constructor(
    @InjectRepository(CustomerService)
    private readonly customerRepository: Repository<CustomerService>,

    private readonly jwtService: JwtService,
  ) {}
  async Login(createCustomerServiceDto: CreateCustomerServiceDto) {
    try {
      const user = await this.customerRepository.findOne({
        where: {
          Email: createCustomerServiceDto.email,
        },
      });

      if (!user) throw new NotFoundException('Email Tidak ditemukan');
      if (user.Pass !== createCustomerServiceDto.password)
        throw new UnauthorizedException('Password Salah');
      const payload = { id: user.Oid, name: user.Username };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '60s',
      });
      return {
        statusCode: HttpStatus.OK,
        accesToken: accessToken,
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}
