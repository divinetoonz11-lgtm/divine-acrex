import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />

      {/* Tawk.to FREE Chatbot */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/REPLACE_WITH_YOUR_ID/1abcdef';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
          `,
        }}
      />
    </>
  );
}

export default MyApp;
