#Journal/log for final project.

#December 17:
“Paper planning.” A brief description of what my power point roughly shows, hopefully with more detail in how it should act. What I want is a home page (call it home?) that displays an assortment of cards (these can be clickable hyperlinks maybe/maybe not?). Beyond that there will be supplemental pages with greater detail organized by type (Detail pages). Generic weather, River data, Tide data, and Air data. (shorten to River, Air, Tides, etc?). Each of these will be its own route. Each unique page will have an identical navbar at the top that has the name of the site (RiverWeather, RiverWatch?)

Initial plan: make this something that will work for just 3 cities, Portland, Cincinnati, and St. Paul. Selected because of their diversity in rivers and weather these should each provide enough differences to make sure all edge/corner cases are covered. Once those work, build it out so that it works for any city that’s searched for via geolocation (Something I’m not much of an expert on, but learned a little about when researching how to do this project.)

Created folder for final project and ran some commands to pull in a vite template, ran npm install, npm run dev, npm install react-router-dom bootstrap, then verified my src/main.jsx page was properly setup. [but it wasn’t]. Ran into issues with Node.js being the 20.11.0 version and Vite requiring 20.12+ or 22.12+ and couldn’t quite get it to update properly despite restarts and other troubleshooting. Admittedly had a bit of a freak out because nothing was working.

Started over with a new folder.
Ran npx create-react-app final-react-cra
Cd final-react-cra,
Npm start.

Initially got some basic errors related to the logo [ERROR in ./src/logo.svg Module build failed] but by deleting the App.js lines that use the react logo corrected this.

Ran “npm install react-router-dom bootstrap” to pull in the libraries for routing and bootstrap.
Updated src/index.js to import bootstrap.

Wrote very basic App.js to manage router, routes, Navlink(s) (maybe 35 lines) Imported the pages from other files (./pages/Home, ./pages/Weather, ./pages/River, ./pages/Tides, ./pages/Air). Setup routing paths for all of these elements as well. Created very basic pages for each as basic placeholders. Src/pages/Home.js; src/pages/Weather.js; src/pages/River.js; etc.

Updated App.js to include navbar and created src/pages/cities.js to handle my test cities.
Added some test code [later removed] to check that changing the selected city would change the data that was pulled.  
[had some issues here, needed to debug, was not properly passing/accepting city in the function.]

Added search bar and dropdown bar to the navigation bar, and built the 3x3 grid for the home page to display the most important weather data at a glance.

Ran into a problem referencing cityid before I declared it (even though we talked about that in class and I was warned!) Fixed that.

#December 18:

Created a folder to organize api calls, and started to implement that. Created src/api/weather.js.
Hard coded city-latitude and longitude into city info, then grabbed that to pass to the api to get the weather data back for the specific city in question. Initially pulled temperature, messed that up, but got it right, then added in everything else wind, precipitation, humidity, pressure, visibility, etc.

Updated home page to fetch this whenever city changes and display the returned data (basic info i.e. number for now, no fancy data visualization tools)

Updated the routes for specific weather page so that it would show the same data, just numbers for now.

#December 19:

Adding in USGS for pulling river depth and speed (called gauge and discharge formally). This pulls from specific rivers in specific cities by a reference number for each USGS site. For now, this can be/is hard coded, NOTE: Later need to find a way to generate these based on other city info.

Building src/api/river.js to manage the api call for the river data. This takes the site number as an argument and uses that to pull the right data from the usgs api. Adjusted App.js to fetch this, and pass it on to the home.js and river.js files.

#December 21:
Fixed river speed and river depth cards on the home page to reflect river flow and river stage (the more technical terms for this data). Built the river page (copy paste from the home data) to also reflect the river data, made a note to add more details later, and create visualizations. Had some debugging again, fixed it by importing my useEffect react function. Also an issue with forgetting to pass riverdata into the home and river pages. All fixed now. Ok, not fixed, (it just stopped breaking and the code was running, but not showing my data.) I did fix the part about passing the data to home, but still couldn’t get it working because I was never using that data. Fixed that, really, now.

#December 22:
Ok, basically did the exact same thing as for river data except for tide(s) data, and pulling it from NOAA site. Had some similar mistakes and troubleshooting issues, but fixed them faster this time without the same amount of effort.

Played around with the tides data a little bit, and tweaked it to the point where it was displaying just the info I wanted.

For data, everything is starting to look like I want it, now I’m shifting gears and going to be focusing on getting the looks exactly the way I want them to be.

#December 23:

Went back and added air quality as well. Removed the barometric pressure from the home page and replaced it with the air quality. Keeping pressure in the specific weather page, but air quality (in PDX anyway) is much more important.

Showed this to a friend who does meteorology work for airports to get some suggestions and feedback. He recommended that it might be best to make the app modular in a way that it could be changed based on a person’s preferences. As I’m setting it up now, it’s mostly static, when you run it Portland comes up first and you can then switch between any of the 3 test/dev cities and also select any of the detail pages, but he recommends allowing users to create an account and select which specific city will be the person’s home city and which data they would want on the home screen and what order. This is probably way too much of an undertaking for the student project, but worth looking into.

Built a specific page for Air (where additional details for air quality will live (mostly a copy/paste of the river page). NOTE, will move wind here away from weather page or duplicate the info? “Air” is a vague idea.

#December 24:

Big step – working on the geocoding from (Openmeteo.com).
The idea here is that users can type in a city name, and that will communicate with the openmeteo site and then convert it into the longitude/latitude info that’s used for the area and allow the site to then return weather data on any searched city rather than just the built in/test ones.  
created a separate api file geocode.js for this.

Got this to work, at least in the basic form, I can input the city name, it populates with a list of suggestions, then clicking the desired one will pull that city’s data and populate the fields with it, but only for open meteo items. The tides (NOAA) and river data (USGS) use city codes and not latitude/longitude coordinates.

Tides are working, but river data isn’t. I’ve spent some time on this without success. Making the decision to continue without it and come back later if time permits.

#December 25:

Data visualizations:

Next step is to implement some visuals, the idea I have/had was to put something small and simple on the home page, the goal there is an easy all-inclusive at-a-glance reference that captures the state of the river and its’ weather. In looking at various options I came across sparklines, which show small line charts of trend data. That seemed reasonable. Long story short, I implemented it for Temperature, which meant modifying what data I pulled from the API (adding in hourly temps). When it was done, I either didn’t do a very good job, or it was extremely far from what I had in mind, so I made the call to remove it. Temperature, unlike pressure or visibility, is a number that’s easily recognizable and can stand alone without any help from a graph or chart.

However, on precipitation I implemented minibars (which were a lot like the sparkline) and that ended up being closer to what I wanted on that chart so I kept it in. Precipitation, was almost the same implementation, the important part was pulling in the right data from the API, hourly precipitation data in this case.

I did want Temperature to provide something visual, so I elected to use color, the background of the temp tile changes from blue all the way to orange/red depending on how cold or warm it is. This could be tweaked a little, because when the temp range is in the forties (as it was for most of the time I spent on this project) it showed a pinkish background. Which mathematically I think is an accurate reflection of the color of that temp in terms of 0-100 but I don’t think it captures and reflects how a human should think about that temp. I think I’d probably tweak it to show bluish colors for anything under fifty and reddish (getting redder as it goes up) for anything above fifty. Here, another rookie mistake, I used current before defining it and did a little troubleshooting to sort that out. For temp and aqi (both that require color) I ended up making a util folder and within it a colors.js file to manage all the color data for all things where it’s used.

Because I thought it was appropriate for the assignment, I did create a proper chart (from chart.js) in the weather specific page. This lists the temp ranges on the y-axis and the times on the x-axis. The precipitation on the detailed data page follows the same pattern, chart.js bar graphs showing the precipitation over time.

For Air quality I also implemented colors (Green, orange, yellow red, purple) along with reference or signal words (good, moderate, bad) to help people grasp the nature of the number. (Speaking for myself I don’t have a good sense of the AQI number alone (aside from the generic low is good, high is bad) so, speaking to the human part of this, this one felt good and sensible to implement.  
[I found government designated pre-defined zones for this stuff (0-50 good, 50-100 moderate, etc.) I’m sure they’re on govt. sites somewhere, but I got this from Wikipedia. For the sake of brevity and not repeating myself throughout, everything I learned on this project that I didn’t already know, unless otherwise stated, came from Wikipedia.]

Humidity, for this I created a progress bar (similar to what’s found on a screen when software is loading but placed the bar beneath the numerical value instead of placing that on top of the bar). One amusing anecdote from implementing this, I’m grateful I created other test cities (and in fact the custom cities were completed as well) before doing this one. I don’t think Portland’s humidity changed much during the entire time I worked on this project.

For the river data (gage and flow) I implemented trend arrows. Effectively these look at the past info and show whether the trend is for the river level to be rising, steady, or falling. Similarly the flow shows trend arrows for whether there’s more, steady, or reducing levels of discharge.

For sunrise, sunset, and tides (on the home page) I simply used bold text to emphasize the pertinent information. (Recall the point of the home page is not to be too busy or show too much it’s to accelerate the understanding of the numerical data). In the weather page, intended to show better detail, I provided a visualization that simulates sunrise and sunset. I also post a disclaimer explaining that this data wasn’t available in the API and that it is simulated.

For the wind, I simply print the description from the Beaufort scale depending on how fast the wind is blowing. In the air specific page I provide a full description of the entire Beaufort scale as a reference.

Worked on output formatting, initially I just displayed the nearly raw info that was returned by the API, timestamps like “2025-12-25 04:05” but changed that to show Tides, next high 4:05 PM (12/25). Made similar adjustments to sunrise and sunset, converting the timestamp looking info into something with less detail but more friendly for reading.

Also updated the location naming for river info, which similarly looked very data-heavy, and opted for something more friendly that just said the river name and location where the data was pulled (Willamette river @ Portland).

Created wind.js (in util folder) to organize function for providing beaufort scale information.

Finally named the application, “River Watch” which I placed in the navigation bar at the top.

Added in some explanations for river flow and visibility. For visibility I learned that it is based on seeing a large object in the distance. The idea occurred to me to simply provide a descriptive reference, so I explained that from the PSU campus Mt. Hood is approximately 70 miles away. (Google Maps). This fails in two big ways, 1. It’s not data visualization, but an explanation, and 2. It’s only useful regionally—someone who has never been to Portland couldn’t possibly use that information to have a sense of things. However it succeeds in that it’s the best way (so far) I could envision taking that raw number and making it instantly useful to me.

#Dec. 26:

Added improvements to the specific weather page. Created a visual bar for the daylight hours, it uses black to indicate night up until the point of sunrise, then it shows gray for a 30 minute block, and then white to indicate daylight hours, then the opposite of that for the sunset, 30 minutes of gray before a black bar to indicate night. This demonstrates the day length. The API didn’t have actual twilight so, using Wikipedia I read that the shortest twilight time is around 20 minutes and the longest is around 50 minutes, regardless of region or season. I faked it by just using 30 minute blocks. In full disclosure I explain this in text within the app. Something I’d like to fix, time permitting, would be to make it display actual sunrise/sunset times in the displayed bar, for now it’s approximations based off of a 24 hour clock with 4 times noted 00, 6:00, 18:00, and 24:00.

#December 27

Also used the chart.js charts for the river page, which shows trend charts when there’s enough data, and displays blank with an explanation that there isn’t enough data when there isn’t. Put the same basic chart in the tides page showing the expected change in tides’ height over time. In the top-left is a single large tile that shows the next tide and when it’s expected, and below that a listing of other upcoming tide changes.

#December 30:
Put in some visual improvements to the air page as well. Copied the AQI index card almost identically from the home page, used the same bar chart from chart.js to show various levels of air pollutants (not actually sure what most of these are, so I’m simply presenting the data to provide detail). I also mostly copy/paste the same info from the wind page, but add a full explanation of the Beaufort scale and what each one actually feels like or looks like on the water.

#December 31-Jan 4:
Continued tweaking and testing things, working on small fixes, debugging, and trying to get the river data to display for the custom cities.

#Jan 5:

Forgot to do something about pressure. Want to fix this to make it more visual, was just displaying the number with “FIX ME” as something to be done later.

Did implement a visual effect for pressure, but it’s really weird, bad even, but it’s better than a simple number and has implemented various human readable cutoffs levels (based on numerical info) that try to predict whether a front is coming or other things.

#Jan 6-Jan12:

Made various edits and changes, worked on journal, added some entries where I forgot to keep up.
