Decided to go the React route, as that is what I am most comfortable in and what I use on a day to day basis.

I created a pusher account with my own dedicated keys passed through the application via env variables.

I was unsure about how you wanted me to deal with the user authentication variables so I decided to implement a randomizer in the same way that was presented in the example.

I hardcoded the data into a database running on AWS RDS with a sample userName, nickname, and image (from a base set of NFT artwork we created for one of our projects that I hosted on in an S3 bucket). On "login" a random user is picked and set as the current authenticated user using the pusher.authenticate(socketId, channel, presenceData) method. 

(disclaimer: Since I had a limited amount of time to hardcode data there are 10 total users - this means that the data selected on random login often gets repeated. I want to be clear that in cases where users are being shown twice, they are unique users with the same data rather than the same user showcasing multiple times.)

I created a simple backend API using Node to authenticate users and create triggers for new members logging in. This is hosted using render.com with endpoint: https://fareharborback.onrender.com

Once logged in, the user data appears as a profile on the upper left corner of the page and every subsequent user that logs in is shown below with more information being shown on hover.

As stated in the example - I limited the amount of viewable users to 4 (in addition to the current user - so 5 total) and every user that logs in after that is shown only on hovering of the text (added an image to the text for increased visibility).

I hosted my code on vercel so that you can test it live and see the functionality:
https://fare-harbor-front.vercel.app/

I wanted to stay within the allotted time (4 hours) so the designs are not expansive. The functionality is fully fleshed out though and I hope I was able to meet the requirements you were looking for. I tried to implement this without asking questions to showcase the ability to work independently and be proactive in my decision making process.

Thanks!
