// Debug tools for Cloudflare preview builds only. Production/custom domains are excluded.
const KEY='shinobi-campaign-test-god-v1';
export function campaignTestAllowed(host){
 return typeof host==='string'&&(/^[a-z0-9-]+\.naruto2-5d\.pages\.dev$/i.test(host)||['localhost','127.0.0.1'].includes(host));
}
export function readCampaignGod(host,storage){if(!campaignTestAllowed(host))return false;try{return storage?.getItem(KEY)==='1';}catch{return false;}}
export function writeCampaignGod(host,storage,on){if(!campaignTestAllowed(host))return false;try{storage?.setItem(KEY,on?'1':'0');return !!storage&&readCampaignGod(host,storage)===!!on;}catch{return false;}}
export function syncGodButton(button,on){if(!button)return;button.textContent='God Mode: '+(on?'ON':'OFF');button.setAttribute('aria-pressed',String(!!on));}
