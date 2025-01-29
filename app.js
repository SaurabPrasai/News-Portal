const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const PORT = process.env.PORT||8080;
const path=require('path');

app.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname, 'views'))
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  Promise.all([
    fetch("https://www.onlinekhabar.com/wp-json/okapi/v1/taja-updates?limit=9"),
    fetch(
      "https://www.onlinekhabar.com/wp-json/okapi/v1/trending-posts?limit=10"
    ),
  ])
    .then(async ([response1, response2]) => {
      const data1 = await response1.json();

      const data2 = await response2.json();

      const combinedData = [...data1.data.news, ...data2.data.news];

      return combinedData;
    })
    .then((data) => {
      // res.json(data)
      return res.render("home", { data: data });
    })
    .catch((err) => {
      console.log("Error in displaying data");
    });
});

app.get("/news/:url", (req, res) => {
  console.log("Hello Saurab");
  const newsUrl = decodeURIComponent(req.params.url);
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  console.log(fullUrl);

  axios.get(newsUrl).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const imageUrl = $(".post-thumbnail img").attr("src");
    const title = $(".entry-title").text().trim();
    console.log(imageUrl);
    console.log(title);
    


    const paragraphs = $(".ok18-single-post-content-wrap p")
      .map((_, p) => $(p).text().trim())
      .get()
      .filter((text) => text && text !== "&nbsp;");
      const description=paragraphs[0];

      console.log(paragraphs);
    const newsDate = $(".ok-news-post-hour span").text().trim();

    res.status(200).render("news", {
      imageUrl,
      title,
      paragraphs,
      newsDate,
      fullUrl,
      description
    });
  });
});

// app.get("/sports", async (req, res) => {
//   axios
//     .get("https://rajdhanidaily.com/id/category/%e0%a4%96%e0%a5%87%e0%a4%b2/")
//     .then((response) => {
//       const html = response.data;
//       const $ = cheerio.load(html);
//       const articles = [];

//       // Select all articles with the class 'elementor-post'
//       $("article.elementor-post").each((index, element) => {
//         const title = $(element).find(".elementor-post__title a").text().trim();
//         const link = $(element).find(".elementor-post__title a").attr("href");
//         const excerpt = $(element)
//           .find(".elementor-post__excerpt p")
//           .text()
//           .trim();
//         const image = $(element)
//           .find(".elementor-post__thumbnail img")
//           .attr("src");

//         articles.push({
//           title,
//           link,
//           excerpt,
//           image,
//         });
//       });

//       console.log(articles);
//     });
// });

// app.get("/finance", (req, res) => {
//   axios
//     .get(
//       " https://rajdhanidaily.com/id/category/%e0%a4%85%e0%a4%b0%e0%a5%8d%e0%a4%a5/"
//     )
//     .then((response) => {
//       const html = response.data;
//       const $ = cheerio.load(html);
//       const articles = [];

//       // Select all articles with the class 'elementor-post'
//       $("article.elementor-post").each((index, element) => {
//         const title = $(element).find(".elementor-post__title a").text().trim();
//         const link = $(element).find(".elementor-post__title a").attr("href");
//         const excerpt = $(element)
//           .find(".elementor-post__excerpt p")
//           .text()
//           .trim();
//         const image = $(element)
//           .find(".elementor-post__thumbnail img")
//           .attr("src");

//         articles.push({
//           title,
//           link,
//           excerpt,
//           image,
//         });
//       });

//       return res.json(articles);
//     });
// });

app.get('/stock-market',(req,res)=>{




  return res.render("stock-market");
})


app.get("/api/market-data/:type",(req,res)=>{

  if(req.params.type === 'brokers'){

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://www.sharesansar.com/top-brokers?draw=1&columns%5B0%5D%5Bdata%5D=DT_Row_Index&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=false&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=number&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=false&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=name&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=false&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=buyerAmount&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=false&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=sellerAmount&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=false&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=totalAmount&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=false&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=differ&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=false&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=matchingAmount&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=false&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=5&order%5B0%5D%5Bdir%5D=desc&start=0&length=-1&search%5Bvalue%5D=&search%5Bregex%5D=false&date=2025-01-28&_=1738142866546',
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 
        'Accept': 'application/json, text/javascript, */*; q=0.01', 
        'Accept-Language': 'en-US,en;q=0.5', 
        'Accept-Encoding': 'gzip, deflate, br, zstd', 
        'X-Requested-With': 'XMLHttpRequest', 
        'Connection': 'keep-alive', 
        'Referer': 'https://www.sharesansar.com/top-brokers', 
        'Cookie': '_ga_FPXFBP3MT9=GS1.1.1738140162.3.1.1738142866.44.0.0; _ga=GA1.2.1559624512.1723179256; XSRF-TOKEN=eyJpdiI6IktxYmlNbzBBdTQ5RTBBUFNqR2w4Y0E9PSIsInZhbHVlIjoiZGNrbnZMRVdvZ2hRdmMrb1BYU1NQKzlJUmRLU1dKWStrTEFab1pGZnBaeFZXdEZGMElNZ1laUzFGdmp0azUvTlo0UkE2V0xsdDROSlBzUGttV2pYbkwzQUVRNzR3OTd3L1pXcFJ4YjFOTDRXeUU0M0h1dUtRanVhOUFhNVNBZ2QiLCJtYWMiOiJiMTUzMzU0NDA5YjAzNWQ2OTU5YzQ5YzYxN2QzNmE4NjIyZWEzNjJkNjIwOGRmMTcxYzYxZDI0YjYxMTE0N2E1In0%3D; sharesansar_session=eyJpdiI6IjhVM2ttU2pHR0ZJZnlOTk85WTZhNXc9PSIsInZhbHVlIjoiaUtyTjhXcDdUbWp3c3NMS0xaNGxiTGVvTEZ1ZWtaWE8vSmk5MmI3ZWpkRU5UT0s5cUxkRTRoUFhDdUZtcG5DYkRxVnkwREpCKzFucHQ1WG5EQmVGc1R2QkxLekVqZEVucVQzdmZpY1VCY0RnUHZLRGt6U3ZaODg1ek1YRlVJb2YiLCJtYWMiOiI5NDhiNTIzY2Q0OGZmMmUyOWJiMjdhNzk4MDRkMDM4MDAzOTc1MDMwZjQzNDNjZTI3OGRmYzJjM2E1OWY3NWQ0In0%3D; _gid=GA1.2.621290843.1738140163; _gat_gtag_UA_24700594_1=1; XSRF-TOKEN=eyJpdiI6Im1heVk4RzRjU3VyZ3p6QUI1bk4vVUE9PSIsInZhbHVlIjoicm52d1cwWnlERWRCWGNFQXRVcC8wYU1yWHRnbE1rZG1mMG9tRWd3V2kxd2lmekt1TDN4dnIvWTR0YWFBRlk5V2xEUmYwMGlLT1BxeWpqMUFUaGJUQTlRZ2R0YzNEdytjYWtFNFNxbktXeTg0Qm1aNmpZbUFsbEpDdDY5aEV2RFgiLCJtYWMiOiI3NWU4N2U5NWJhZTM4ODIxYTRjZDk4MGE1MzYyZjFkZTE4NmNjYWU0YWE4ZTcwMmRiOTU0MzY1OGQ3MjYxY2ZmIn0%3D; sharesansar_session=eyJpdiI6Ijlhd1p0YXFUa0t5NU1ITlU3bXN2V3c9PSIsInZhbHVlIjoiUmNLOWdlcDdGd3JZNTBMOTJUQ0ZMWHZGWEZkS3ExdG9oTEpkM1p6VUpCTVowQmZpVFVOME9rcGpJTDhQWlJRVkt0aTFOMFVWLzFCNXBsME9FeUtmV29UM2pNellQdkFWdnNoTE4wYnhudDI1Rnp3SExxNjRsZW9iaEZKckdUdEEiLCJtYWMiOiJiNTFiMzgyOGNlODdkZjYwYjgwMTM2MzQyMzIwYzYyM2M2YjNhMmM4MDBhY2E3MWYyZjcyNWNhMzlhYzYyYzVmIn0%3D', 
        'Sec-Fetch-Dest': 'empty', 
        'Sec-Fetch-Mode': 'cors', 
        'Sec-Fetch-Site': 'same-origin', 
        'TE': 'trailers'
      }
    };
    
    axios.request(config)
    .then((response) => {
     return res.json(response.data.data)
    })
    .catch((error) => {
      console.log(error);
    });
    


  }else{

    
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://www.sharesansar.com/top-${req.params.type}?draw=1&columns%5B0%5D%5Bdata%5D=DT_Row_Index&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=false&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=symbol&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=false&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=companyname&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=false&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=close&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=false&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=change_pts&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=false&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=diff_per&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=false&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&start=0&length=50&search%5Bvalue%5D=&search%5Bregex%5D=false&_=1738140225156`,
    headers: { 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 
      'Accept': 'application/json, text/javascript, */*; q=0.01', 
      'Accept-Language': 'en-US,en;q=0.5', 
      'Accept-Encoding': 'gzip, deflate, br, zstd', 
      'X-Requested-With': 'XMLHttpRequest', 
      'Connection': 'keep-alive', 
      'Referer': 'https://www.sharesansar.com/top-gainers', 
      'Cookie': '_ga_FPXFBP3MT9=GS1.1.1738140162.3.1.1738140225.60.0.0; _ga=GA1.2.1559624512.1723179256; XSRF-TOKEN=eyJpdiI6IlhRYVZJTzlDMGVUYnlJR0phQmNJbnc9PSIsInZhbHVlIjoiZm9RcmJPT2xPWnowT013REN5WlpJRFJhaktxdlNSMjF5MkppYjhIQ3NkSmNwVmxKd3B4VmRPOWFzTVR3RDlZdEROT3laTlVKN2hVZmJQWm1vUUZ5NlFmNndqYXBqR0NuTW1lWHM5NDA2QU9IMmlPUFZaeVhScXh3K1Y4RnkySjUiLCJtYWMiOiI4ODk5MjM2YmUwMmNmYzUyNjBkNDlkNWU3MzVlZWQ1ZWEyY2EyNmI0MWRjOWY1MTYxNTVjMTcxNTAzNTYxMGNiIn0%3D; sharesansar_session=eyJpdiI6InhDdVNPekJpck54TTcvVTd4bnBoc3c9PSIsInZhbHVlIjoiUEtqd0FpckxpZVpQRjYvRmhZRWpEd1pmNlE0ek0yZGhLZngxdUtmY0Nxam5CbFQ3NG9sN0tJL3hnOUtXak4zeERvWi9oaUJYVVg4VDNramRRSmQyYkZmOWpLL0RFMVlla1pBUjZlUk1lYlJ1QkI5cW5XeHQrbSs4ZGJoRVlTTUkiLCJtYWMiOiIyODIxZTYxYTkxMGE1NTE3ZDdlZDg0MzQyNzJmODVlZWZjY2Q5ODViMjNhMjQzMjA0ZDlhMjM2ZmQyNWJmZTg3In0%3D; _gid=GA1.2.621290843.1738140163; XSRF-TOKEN=eyJpdiI6Ik1BT2djL3l1SUp5WFY0UmpuT2NnMkE9PSIsInZhbHVlIjoiczY4RUdINGplZDZQTkJybThwaHNwSWhsMDRtRFYwSXIzSHdxcFIwalEvU1ZwSXE5bmhzYmY5LzBvazlrby9ESUxzaHh2V2tNRHJwMjhIMFlEMjJwUjRseVNQS3BxbWZuSzF5enYxK1loaktQNERaRTMrMko3MmRSb2xKQjF5QUciLCJtYWMiOiI4ZTU0YzZjNjJhZjM5MzYzODA0ZDEyOGZkNDFkMTQxNGU3MmEwNWRlMTI3ZmVmMjBmNWFkNjU5ZmU1MDNmMDllIn0%3D; sharesansar_session=eyJpdiI6Ii8rdkVDMjFTbUFJa3ZFUXdJMGtjN1E9PSIsInZhbHVlIjoiWFpWN1locWQrSFJ2anJtZnJkZ0NobWwxaDFHUGIzWHVqdmVMd20vV0xYNVFCenVvYzgwbFpWbjFHazcrYng3d0NmUHFHdmNWRkZjbVloNlp5TGVvMXEwZ2xFR1Qza3R3Slh2d1U0cXFHcGFlNG5HdlpUbm84MFVUR0hDOXpNcWIiLCJtYWMiOiI5ODA1Mzk3M2Y3NTFiNmUwMmFiMDczNDkyZWU5NmY2NzNiMTNlZTEwM2QwYjFlYzk3ZmYyOWJmYjAxOWMwMmJkIn0%3D', 
      'Sec-Fetch-Dest': 'empty', 
      'Sec-Fetch-Mode': 'cors', 
      'Sec-Fetch-Site': 'same-origin', 
      'TE': 'trailers'
    }
  };
  
  axios.request(config)
  .then((response) => {
   return res.json(response.data.data)
  })
  .catch((error) => {
    console.log(error);
  });

  }


})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
