# Bookman
### About
It is a online library designed for Bibliophile or any person who loves to read books, where people can register their books/novels and at the same time have access to all the amazing books/novels belonging to the students on the campus. This would provide a reader with a huge collection of books and moreover, they would not have to pay such huge amounts of money to buy a book which they might just read once in their life. To encourage students to update the platform with new books, a small amount of money is added for borrowing the book which is fixed by the system for different price of books.
To borrow any of your favourite book, you just have to fill your contact details and our server will automatically mail your contact details directly to the owner of book.

It is designed mainly for IITR but can be used at any level. Fields like enrollment no are added by keeping college system in mind.

### Key inclusions:
- Authentication for each individual user.
- Authentication is must to post or borrow any book.
- Email verification is must to activate the account.
- Homepage showing all availaible books posted by people.
- Individual web pages to showcase individual books to show the description of the book (i.e. owner, a short description about the book, photo of the book, lending price, etc)
- Webpage where the borrower fills in their details and where submitting the details, emails the owner of the book about the borrower.
- Webpage where a new book can be added to the collection. The owner has to provide the necessary details about himself and the book. (i.e. Name, name of the book, short description of the book, email address, etc.)
- A search feature in the catalog with a sort option.
- Pagination features while showcasing the books.
- User profile page showing all details of user and books details registered by that user
- Error Handing in all forms (i.e. verification of proper contact no, email address, etc using regex)


### Major Tech Stack:
React, Nodejs, MongoDB, Express, Nodemailer

### Preview:

**Homepage**
![bookman_homepage](https://user-images.githubusercontent.com/60233336/108219622-ec93bd80-715b-11eb-98f2-b9f16c0b94ba.png)
<br>
**Register book page**
![Screenshot from 2021-02-17 19-20-47](https://user-images.githubusercontent.com/60233336/108213780-696f6900-7155-11eb-812c-429842945e69.png)
<br>
**Individual book page**
![Screenshot from 2021-02-17 19-34-19](https://user-images.githubusercontent.com/60233336/108215295-2f9f6200-7157-11eb-90fb-c70acba52d5c.png)
<br>
**User profile page**
![bookman_profile](https://user-images.githubusercontent.com/60233336/108214994-d1727f00-7156-11eb-8fd5-ed27ffb95579.jpg)
<br>
**Mail Preview**
![Screenshot from 2021-02-17 19-39-47](https://user-images.githubusercontent.com/60233336/108215966-ebf92800-7157-11eb-97e2-66eaaa54cc9f.png)

### Installation

```
Open terminal
https://github.com/saurabhhere/Bookman-bookborrowsystem.git
cd Bookman-bookborrowsystem
```
For client side:
```
cd client
npm install
npm start
```
For server side:
```
cd server
npm install 
nodemon server
```
Add .env file in server folder containing:
```
JWT_SECRET = your_secret_string
EMAIL = your_email_for_nodemailer
PASSWORD = your_email_password
CONNECTION_URL = your_mongodb_url
```



