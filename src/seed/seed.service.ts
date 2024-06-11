import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";

@Injectable()
export class SeedService {

  constructor(private readonly productsService: ProductsService,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
  ){

  }
  
  async runSeed(){
    await this.deleteTables();    
    const adminUser= await this.insertUsers();
    await this.insertNewProducts(adminUser);
  }


  private async insertUsers(){
    const seedusers=initialData.users;
    const users:User[]=[];

    seedusers.forEach(user=>{
      // user.password= bcrypt.hashSync( user.password,10)
      users.push(this.userRepository.create(user))
    });

    const dbUsers=  await this.userRepository.save(users);
    
    return dbUsers[0];
  }
  
  private async deleteTables(){
    await this.productsService.deleteAllProducts();
    
    const queryBuilder=this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

 private async insertNewProducts(user:User){
  //  await this.productsService.deleteAllProducts();
   const products=initialData.products;
   const insertPromises=[];

  products.forEach(product=>{
   insertPromises.push (this.productsService.create(product,user));
  })

  await Promise.all(insertPromises);
   return true;
}
}
