# Seleksi_Labpro_BE

Vincent Prasetiya Atmadja  
13520099

## Cara Menjalankan  
Terdapat 2 cara menjalankan, menggunakan docker dan tidak
1. Menggunakan docker (bisa berjalan dan migrate, tetapi entah mengapa tidak bisa ke connect localhostnya)  
Command: `docker-compose up`
2. Menggunakan package-manager.  
Ada 2 cara, menggunakan npm dan yarn  
    - npm  
    `npm run dev`
    - yarn  
    `yarn run dev`

## Design Pattern  
Design pattern utama yang digunakan untuk backend hanya singleton. Singeton digunakan dalam service yaitu prisma dan express sendiri. Selain singleton, saya sepertinya tidak memakai design pattern lain, tetapi mengusahakan backend ini mengikuti prinsip SOLID

## Techonology Stack
Berikut ini beberapa dependency yang digunakan
1. express (^4.18.1)  
2. prisma (^4.1.1)
3. typescript (^4.7.4)
4. nodemon (^2.0.19)
5. jsonwebtoken (^8.5.1)
6. memory-cache (^0.2.0)
7. cors (^2.8.5)

Selengkapnya dapat dilihat pada package.json

## Endpoint API

Endpoint yang digunakan adalah 
1. `/profile`, method get dan patch
2. `/mutasi`, method patch, post, dan get
3. `/history`, method get
4. `/authen`, method get, post, dan patch