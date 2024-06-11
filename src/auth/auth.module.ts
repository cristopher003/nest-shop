import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],

  // para persitir el modelo de la base de datos
  imports:[TypeOrmModule.forFeature([User]),

  // npm install --save-dev @types/passport-jwt
  // npm install --save @nestjs/passport passport
  // npm i --save-dev @types/bcrypt

    // configuracion sincrona del modulo de autenticacion
  PassportModule.register({defaultStrategy:'jwt'}),
  // JwtModule.register({secret:process.env.JWT_SECRET,signOptions:{expiresIn:'2h'}})

  JwtModule.registerAsync({
    imports:[ConfigModule,ConfigModule],
    inject:[ConfigService],
    useFactory:(configService:ConfigService)=>
      { return {
        secret:configService.get('JWT_SECRET'),
        signOptions:{expiresIn:'2h'}} } 
    })
],
  exports:[TypeOrmModule,JwtStrategy,PassportModule,JwtModule]
})
export class AuthModule {}
