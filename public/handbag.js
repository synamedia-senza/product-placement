async function getPrompt() {
  let style = "Andy Warhol";
  let person = "a robot";
  let product = "flamingo";
  let place = await getPlace();
  return `A photo in the style of ${style} of ${person} with ${product} on the street in ${place}.`;
}

async function getPlace() {
  let ipAddress = senza.deviceManager.deviceInfo.clientIp;
  if (ipAddress == "0.0.0.0") ipAddress = "";
  let ipdataUrl = `https://api.ipdata.co/${ipAddress}?api-key=${IPDATA_API_KEY}`;
  let ipdata = await (await fetch(ipdataUrl)).json();
  let ipdataCountryCode = ipdata.country_code;
  let deviceCountryCode = senza.deviceManager.deviceInfo.countryCode;
  
  if (deviceCountryCode == ipdataCountryCode || deviceCountryCode == "XX") {
    return `${ipdata.city}, ${ipdata.region}`;
  } else {
    return countries[deviceCountryCode];
  }
}

async function generate(prompt) {
  try {
    let url = "/generate?q=" + encodeURIComponent(prompt);
    let response = await fetch(url);
    let data = await response.json();
    return data.src;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function update() {
  try {
    let prompt = await getPrompt();
    let src = await generate(prompt);
    image.src = src;
  } catch (error) {
    console.error('Error generating URL:', error);
  }
}

window.addEventListener("load", async () => {
  await senza.init();
  update();
});

