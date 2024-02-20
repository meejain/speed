// Input data of URL's to be tracked

let raw_data = [
  {
      "Company_Name": "CUNA",
      "New_Relic_Enduser_URL": "https://www.cunacouncils.org"
  }, 
  {
      "Company_Name": "Cambridge Investment Research",
      "New_Relic_Enduser_URL": "https://www.joincambridge.com/"
  }
]

async function lhsrun(site, customer) {
  const terms = [".json", "?", "granite/core", "404.html", "healthcheck", "jpg", "css", "svg", "*"];
  const result1 = terms.some(term => site.includes(term));
  if (result1) { console.log(customer + "#" + site + "#" + "We need a different URL"); }
  else {
      const conditions = ["Unable to process request"];
      const urlMobile = setUpQueryMobile(site);
      const urlDesktop = setUpQueryDesktop(site);
      const responseMobile = await fetchURL(urlMobile);
      const responseDesktop = await fetchURL(urlDesktop);
      (responseMobile.error) ? ((conditions.some(el => responseMobile.error.message.includes(el))) ? lhsrun(site, customer) : console.log(customer + "#" + site + "#" + " LHS is erroring with " + responseMobile.error.message)) : console.log(customer + "#" + site + "#" + (Math.round(responseMobile.lighthouseResult.categories.performance.score * 100) + "%") + "#" + (Math.round(responseDesktop.lighthouseResult.categories.performance.score * 100) + "%"));
      // (responseMobile.error) ? ((conditions.some(el => responseMobile.error.message.includes(el))) ? lhsrun(site, customer) : console.log(customer + "#" + site + "#" + " LHS is erroring with " + responseMobile.error.message)) : console.log(customer + "#" + site + "#" + (Math.round(responseMobile.lighthouseResult.categories.performance.score * 100) + "%"));
  }
}

async function fetchURL(url) {
  const resp = await fetch(url);
  const response = await resp.json();
  return response;
}

// Tracking LHS for Mobile

function setUpQueryMobile(site) {
  const YOUR_API_KEY = "AIzaSyCwZkCTnraHXOjnCWuq2oxXJOE-ll1hzuI";
  const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  if (!site.startsWith('http')){ site = "https://" + site; }
  const parameters = {
      url: encodeURIComponent(site)
  };
  let query = `${api}?`;
  for (let key in parameters) {
      query += `${key}=${parameters[key]}`;
  }
  // Add API key at the end of the query
  query += "&strategy=mobile";
  query += `&key=${YOUR_API_KEY}`;
  return query;
}

// Tracking LHS for Desktop

function setUpQueryDesktop(site) {
  const YOUR_API_KEY = "AIzaSyCwZkCTnraHXOjnCWuq2oxXJOE-ll1hzuI";
  const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  if (!site.startsWith('http')){ site = "https://" + site; }
  const parameters = {
      url: encodeURIComponent(site)
  };
  let query = `${api}?`;
  for (let key in parameters) {
      query += `${key}=${parameters[key]}`;
  }
  // Add API key at the end of the query
  query += `&key=${YOUR_API_KEY}`;
  return query;
}

const CrUXApiUtil = {};
// Get your CrUX API key at https://goo.gle/crux-api-key.
CrUXApiUtil.API_KEY = 'AIzaSyCvoXFk31F4fCScVaoDoZiZ-J2pKU7fTHw';
CrUXApiUtil.API_ENDPOINT = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${CrUXApiUtil.API_KEY}`;
CrUXApiUtil.query = async function (requestBody) {
console.log(requestBody);
try {
  const response =  await fetch(CrUXApiUtil.API_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(requestBody)
  });
  const data = await response.json();
  assessCoreWebVitals(data);
} catch (error) {
  console.error('CrUXApiUtil.query failed', error);
} 
};

function assessCoreWebVitals(response) {
  const CORE_WEB_VITALS = [
      'largest_contentful_paint',
      'first_input_delay',
      'cumulative_layout_shift'
    ];
    CORE_WEB_VITALS.forEach((metric) => {
      const result = JSON.stringify(response.record.metrics[metric]);
      if (!result) {
        console.log(`No data for ${metric}`);
        return;
      } else {
          const p75 = JSON.stringify(response.record.metrics[metric].percentiles.p75);
          const threshold = JSON.stringify(response.record.metrics[metric].histogram[0].end);
          console.log("Percentile 75% for ", metric, ":" ,"Threshold Value = ", threshold, "Current Value = ", p75);
      }
    });
}


async function cruxfunction(url) {
  CrUXApiUtil.query({
    origin: url
  });
}

async function mainfunction() {
  for (let i = 0; i <= (raw_data.length-1); i++) {
      if ((!raw_data[i].Company_Name) && (!raw_data[i].New_Relic_Enduser_URL)) { console.log("\n"); continue; }
      if (raw_data[i].New_Relic_Enduser_URL) {
          await lhsrun(raw_data[i].New_Relic_Enduser_URL,raw_data[i].Company_Name);
          await cruxfunction(raw_data[i].New_Relic_Enduser_URL);
      } else {
          console.log(raw_data[i].Company_Name+"##No New_Relic_Enduser_URL");
      }
  }
}

mainfunction();

