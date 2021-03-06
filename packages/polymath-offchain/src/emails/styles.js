// FIXME @RafaelVidaurre: Use emotion to manage styles
export default `
  body {
    font: small/1.5 -apple-system, BlinkMacSystemFont, Arial, Helvetica, sans-serif;
    color: #152935;
    font-size: 16px;
  }
  
  a {
    color: #3D70B2 !important;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  ul,
  ol {
    margin-top: 5px;
  }
  
  ul li,
  ol li {
    font-size: 18px;
    margin-bottom: 7px;
  }
  
  ol li {
    padding-left: 5px;
  }
  
  h1 {
    font-size: 36px;
    line-height: 43px;
    font-weight: 600;
    color: #252E6A;
    margin-top: 0;
    margin-bottom: 11px;
  }
  
  h2 {
    font-size: 20px;
    line-height: 28px;
    color: #152935;
    font-weight: normal;
  }
  
  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #152935 !important;
  }
  
  h4 {
    color: #3D70B2;
    font-size: 14px;
    line-height: 18px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 0;
  }
  
  .wrapper {
    width: 768px;
    margin: 0 auto;
  }
  
  .top-bar {
    height: 48px;
    border-bottom: 1px solid #DFE3E6;
    padding-left: 72px;
    margin-bottom: 24px;
  }
  
  .top-bar img {
    margin-top: 11px;
    width: 188px;
    height: 29px;
  }
  
  .content {
    padding: 3px 72px 25px;
  }
  
  .main-value {
    width: 624px;
    height: 160px;
    background-color: #EBF0F7;
    border-radius: 4px;
    margin-bottom: 32px;
    margin-top: 28px;
  }
  
  .main-value h2 {
    line-height: 18px;
    text-align: center;
    padding-top: 19px;
    font-weight: 600;
  }
  
  .main-value .value {
    width: 560px;
    height: 64px;
    line-height: 64px;
    text-align: center;
    font-size: 20px;
    background-color: white;
    margin: 0 auto;
    vertical-align: middle;
  }
  
  .icon-text {
    margin-bottom: 30px;
  }
  
  .icon-text .icon {
    width: 48px;
    height: 100%;
    float: left;
  }
  
  .icon-text .icon.question {
    margin-top: 5px;
  }
  
  .icon-text .icon img {
    width: 32px;
    height: 32px;
    margin-top: 4px;
  }
  
  .icon-text h2 {
    margin: 0;
    line-height: 25px;
  }
  
  .icon-text p {
    margin-top: 3px;
  }
  
  .icon-text.tx-hash {
    height: 57px;
    margin-top: 20px;
  }
  
  .text {
    margin-bottom: 26px;
    color: #5A6872;
  }
  
  .text p {
    font-size: 18px;
  }
  
  .value {
    margin-top: 13px;
  }
  
  .value p {
    margin-top: 8px;
  }
  
  .value strong {
    color: #152935 !important;
  }
  
  .footer {
    height: 48px;
    border-top: 1px solid #DFE3E6;
    padding-left: 72px;
    padding-right: 72px;
    font-size: 14px;
    color: #5A6872;
    padding-top: 14px;
  }
  
  .footer .left,
  .footer .right {
    float: left;
    width: 50%;
  }
  
  .footer .right {
    text-align: right;
  }
  
  .footer a {
    color: #5A6872 !important;
    margin-left: 40px;
  }
  
  .tx {
    float: left;
    width: 300px;
    height: 25px;
    border-radius: 4px;
    background-color: #EBF0F7;
    font-size: 12px;
    line-height: 25px;
    padding: 0 16px;
    margin-top: 6px;
    text-align: center;
  }
  
  .tx a {
    text-decoration: underline;
  }
  
  .sincere {
    font-weight: 600;
    color: #252E6A;
    line-height: 31px;
  }
`;
