import { useState } from 'react';

const dictionary: Record<string, Record<string, string>> = {
  "brand.title": {
    en: "Senior Citizen Recreation Centre",
    ne: "ज्येष्ठ नागरिक मिलन केन्द्र",
  },
  "brand.sub": {
    en: "Shri Ramkrishna Namdev Samaj Sansthan",
    ne: "श्री रामकृष्ण नामदेव समाज संस्थान",
  },
  "nav.home": { en: "Home", ne: "होम" },
  "nav.about": { en: "About", ne: "परिचय" },
  "nav.members": { en: "Members", ne: "सदस्य" },
  "nav.members.Founding": { en: "Founding Members", ne: "आदरणीय सदस्य" },
  "nav.members.Lifetime": { en: "Lifetime Members", ne: "आजीवन सदस्य" },
  "nav.members.Senior-Citizen": {
    en: "Senior-Citizen Citizen Members",
    ne: "ज्येष्ठ नागरिक सदस्य",
  },
  "nav.members.donation": { en: "Donation Members", ne: "दान सदस्य" },
  "nav.members.Helping": { en: "Helping Members", ne: "सहयोगी सदस्य" },
  "nav.news": { en: "News", ne: "समाचार" },
  "nav.gallery": { en: "Gallery", ne: "गैलरी" },
  "nav.notices": { en: "Notices", ne: "सूचना" },
  "nav.contact": { en: "Contact", ne: "सम्पर्क" },
  "nav.admin": { en: "Admin", ne: "प्रशासन" },
  "nav.donate": { en: "Donate", ne: "दान" },
  "hero.step1": { en: "Center", ne: "केंद्र" },
  "hero.step2": { en: "Mandal", ne: "मंडल" },
  "hero.step3": { en: "Branch", ne: "शाखा" },
  "intro.heading": { en: "Welcome Message", ne: "स्वागत संदेश" },
  "intro.p": {
    en: "Our community focuses on unity, cooperation and progress. Various social, cultural and educational activities are organized.",
    ne: "हमारे समाज का उद्देश्य एकता, सहयोग और प्रगति है। यहां विभिन्न सामाजिक, सांस्कृतिक और शैक्षणिक गतिविधियों का आयोजन किया जाता है।",
  },
  "activities.title": { en: "Our Activities", ne: "हमारी गतिविधियाँ" },
  "leaders.title": { en: "Our Leadership", ne: "हमारे नेतृत्व" },
  "core.title": { en: "Core Management Team", ne: "कोर मैनेजमेंट टीम" },
  "staff.title": { en: "Office Staff", ne: "ऑफिस स्टाफ" },
  "gallery.title": { en: "Gallery", ne: "गैलरी" },
  "gallery.memories": { en: "Our Memories", ne: "Our Memories" },
  "gallery.video": { en: "Video Gallery", ne: "Video Gallery" },
  "news.title": { en: "News & Updates", ne: "समाचार एवं अद्यतन" },
  "news.read_more": { en: "Read more", ne: "Read more" },
  "subscribe.title": { en: "Subscribe", ne: "सब्स्क्राइब" },
  "subscribe.cta": { en: "Subscribe", ne: "सब्स्क्राइब" },
  "contact.title": { en: "Contact Us", ne: "संपर्क करें" },
  "contact.details": { en: "Contact Details", ne: "सम्पर्क विवरण" },
  "contact.formTitle": { en: "Get In Touch", ne: "सम्पर्क गर्नुहोस्" },
  "contact.name": { en: "Name", ne: "नाम" },
  "contact.email": { en: "Email", ne: "ईमेल" },
  "contact.phone": { en: "Phone", ne: "फोन" },
  "contact.message": { en: "Message", ne: "संदेश" },
  "contact.send": { en: "Send", ne: "भेजें" },
  "donate.support": {
    en: "Support our Cause",
    ne: "आम्रो उद्देश्यलाई सहयोग गर्नुहोस्",
  },
  "donate.formTitle": { en: "Donation", ne: "Donation" },
  "donate.address": { en: "Address", ne: "ठेगाना" },
  "donate.amount": { en: "Amount in Rs", ne: "रकम (Rs)" },
  "donate.accTitle": { en: "Account Details:", ne: "खाता विवरण:" },
  "donate.bank": { en: "Bank Name", ne: "बैंक" },
  "donate.accountName": { en: "Account Name", ne: "खाता नाम" },
  "donate.accountNo": { en: "Account No.", ne: "खाता नं." },
  "footer.join": { en: "Connect with us", ne: "हमसे जुड़े" },
  "about.title": { en: "Introduction", ne: "परिचय" },
  "about.heading": { en: "Introduction", ne: "परिचय" },
  "about.p1": {
    en: "The Senior Citizen Recreation Centre was founded to provide social and psychological support to elders.",
    ne: "ज्येष्ठ नागरिक मिलन केन्द्र, तिलोत्तमा, रूपन्देही को स्थापना वृद्ध नागरिकहरूको सामाजिक तथा मनोवैज्ञानिक सहाराका लागि गरिएको हो।",
  },
  "about.p2": {
    en: "Through activities and programs, members exchange experience, knowledge and skills.",
    ne: "विभिन्न कार्यक्रमहरू मार्फत नागरिकहरूले आफ्नो अनुभव, ज्ञान र सीप आदानप्रदान गर्ने वातावरण बनाएको छ।",
  },
  "Helping.title": { en: "Helping Members", ne: "Helping Members" },
  "band.title": {
    en: "Give Your Loved Ones Quality Care You Can Trust",
    ne: "आफ्नो प्रियजनलाई विश्वासिलो गुणस्तरको हेरचाह दिनुहोस्",
  },
  "band.org": {
    en: "Senior-Citizen Citizen Recreation Centre (SCRC)",
    ne: "ज्येष्ठ नागरिक मिलन केन्द्र (SCRC)",
  },
  "band.tag": {
    en: "Honoring Elders in a Civilized Society",
    ne: "सभ्य समाजमा ज्येष्ठहरूको सम्मान",
  },
  "band.addr": { en: "Tilottama-4, Rupandehi", ne: "तिलोत्तमा-४, रुपन्देही" },
  "band.phone": { en: "+977-9857032166", ne: "+977-9857032166" },
  "band.email": {
    en: "scrc.rupandehi@gmail.com",
    ne: "scrc.rupandehi@gmail.com",
  },
  "member.occupation": { en: "Occupation", ne: "पेशा" },
  "member.type": { en: "Member Type", ne: "सदस्य प्रकार" },
  "member.permAddr": { en: "Permanent Address", ne: "स्थायी ठेगाना" },
  "member.tempAddr": { en: "Temporary Address", ne: "अस्थायी ठेगाना" },
  "member.father": { en: "Father's Name", ne: "बुबाको नाम" },
  "member.mother": { en: "Mother's Name", ne: "आमाको नाम" },
  "member.gf": { en: "Grandfather's Name", ne: "हजुरबुबाको नाम" },
  "member.gm": { en: "Grandmother's Name", ne: "हजुरआमाको नाम" },
  "member.dob": { en: "Date of Birth", ne: "जन्म मिति" },
  "member.amount": { en: "Amount Donated", ne: "दान रकम" },
};

export function useTranslation() {
  const [lang, setLang] = useState<'en' | 'ne'>('ne');

  const t = (k: string) => {
    return dictionary[k]?.[lang] ?? k;
  };

  return { t, lang, setLang };
}
