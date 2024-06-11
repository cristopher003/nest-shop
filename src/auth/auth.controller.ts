import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { UserRoleGuard } from './guards/user-role.guard';
import { Auth } from './decorators/auth.decorator';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth')
  @Auth()
  // @UseGuards(AuthGuard() ,UserRoleGuard)
  checkAuthStatus(  @GetUser() user:User ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user:User,
    @GetUser('email')  userEmail:string,
    @RawHeaders() rawHeaders:string[] ) {
    return user;
  }

  @Get('private2')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard() ,UserRoleGuard)
  testingPrivateRoute2(
    @GetUser() user:User, ) {
    return user;
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  testingPrivateRoute3(
    @GetUser() user:User, ) {
    return user;
  }
}
