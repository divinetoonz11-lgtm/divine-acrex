// components/SEO.jsx
import Head from "next/head";

export default function SEO({ 
  title = "DivineAcrex",
  description = "Find properties, rentals, plots, villas, commercial spaces and list your property for free.",
  keywords = "real estate, property, rent, buy, divine acrex, flat, home, villa",
  image = "/images/seo-banner.png",
  url = "https://divineacrex.com"
}) 
{
  return (
    <Head>
      <title>{title} | DivineAcrex</title>

      <meta name="description" content={description}/>
      <meta name="keywords" content={keywords}/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>

      {/* Open Graph */}
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      <meta property="og:image" content={image}/>
      <meta property="og:url" content={url}/>
      <meta property="og:type" content="website"/>

      {/* Twitter */}
      <meta name="twitter:title" content={title}/>
      <meta name="twitter:description" content={description}/>
      <meta name="twitter:image" content={image}/>
      <meta name="twitter:card" content="summary_large_image"/>
    </Head>
  );
}
