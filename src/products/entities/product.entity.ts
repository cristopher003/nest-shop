import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name:'products'})
export class Product {

    @ApiProperty(
      { uniqueItems:true,
        example:"2333",
        description:'Product ID',
      })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty(
      {
        example:"title 1",
        description:'Product Title',
      })
    @Column('text',{unique:true})
    title:string;
    
    @ApiProperty()
    @Column('float',{default:0})
    price:number;

    @ApiProperty()
    @Column("text",{nullable:true})
    description:string;
    
    @ApiProperty()
    @Column("text",{unique:true})
    slug:string;

    @ApiProperty()
    @Column("int",{default:0})
    stock:number;

    @ApiProperty()
    @Column("text",{array:true})
    sizes:string[];

    @ApiProperty()
    @Column("text")
    gender:string;

    @ApiProperty()
    @Column("text",
    {array:true,default:[]})
    tags:string[];

    @ApiProperty()
    @OneToMany(
      ()=>ProductImage,
      (productImage)=>productImage.Product,
      {cascade:true,eager:true}
    )
    images?:ProductImage[];


    @ManyToOne(
      ()=>User,
      (user)=> user.product
    )
    user:User;

    @BeforeInsert()
    checkSlugInsert(){
        if (!this.slug) {
            this.slug=this.title         
          }
            this.slug=this.title.
            toLocaleLowerCase().replaceAll(' ','_').replaceAll("'",''); 
    }

    @BeforeUpdate()
    checkSlugUpdate(){
            this.slug=this.title.
            toLocaleLowerCase().replaceAll(' ','_').replaceAll("'",'');         
    }
}
