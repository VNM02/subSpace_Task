const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000; 
const _= require('lodash');

let num=0;              // Total number of blogs

let arr=[];            // The array that would contain all the unique blog-titles
let allData=[];
function check(obj,vec)
{
  let flag=1;
  for( key in vec)
  {

      if(vec[key]!=obj[key])
      {
        flag=0;
        break;
      }
    
  }
  return flag;
}

app.use('/api/blog-stats', async (req, res, next) => {
  try {
    const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
    const headers = {
      'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
    };

    const response = await axios.get(url, { headers });

    req.blogData = response.data;
    allData=response.data.blogs;
    console.log("All data is here");
    console.log(allData);
    next();
  } catch (error) {
    console.error(`Error!!!`);
    
  }
});

app.use('/api/blog-search',(req,res,next)=>{
  if(allData.length==0)
  {
    res.send("Please make a request to /api/blog-stats first");
  }
  else
  {
    const vec=req.query;
    let ans=allData.filter(x=>check(x,vec));
    res.json(ans);
    next();
  }
})



app.get('/api/blog-stats', (req, res) => {

  const { blogData } = req;
  //console.log(blogData);
  let long=blogData.blogs[0];                 // The longest blog 

  for(let x in blogData.blogs){                // Nested loop to find all the unique blogs , and the longest blog 
    let flag=0;
    let temp=blogData.blogs[x];
    for(let y in arr){ 
      let temp2=arr[y];
      if(temp2 == temp.title)
      {
        flag=1;
        break;
      }
    }
    if(flag==0)
    {
      arr.push(temp.title);
    }
    if(temp.title.length>long.title.length)
    {
      long=temp;
    }
  }
  const packet={
    "total_blogs":num,
    "longest_blog":long,
    "longest_title":long.title,
    "unique_blogs":arr
  }
  res.json(packet);

});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});