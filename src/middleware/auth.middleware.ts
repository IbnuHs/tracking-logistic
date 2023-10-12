// import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   constructor(private readonly jwtService: JwtService) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const header :string = req.headers.authorization || req.headers;

//     const token: string = header.split(' ')[1];
//     if (!token) throw new UnauthorizedException('Token Tidak Ditemukan');

//     try {
//       const decoded = await this.jwtService.verifyAsync(token);
//       req['user'] = token;
//       next();
//     } catch (error) {
//       throw new UnauthorizedException(error.message);
//     }
//   }
// }
