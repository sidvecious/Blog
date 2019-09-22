### Blog

#### verbatin 
This is a simple *pet project* for a backend that handles sign-in and sign-up for a blog.  
A small part of frontend is present, thanks to the ejs template engine.
For this project in node.js I used the express framework because of the stability and the extensive documentation available.
Other dependecies required are **Body-parser** for handle POST parameters and the library **lodash**.
I also used bcrypt and cookie-parser to hash password and cookie values in the next update I intend to make a connection with mongodb and create a real **CRUD** structure. 

#### run
```bash
git clone https://github.com/sidvecious/Blog.git
cd Blog
npm install
npm run dev

# open browser at localhost:8080
```