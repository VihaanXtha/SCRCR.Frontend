import { useState } from 'react';

const dictionary: Record<string, Record<string, string>> = {
  "brand.title": {
    en: "Senior Citizen Recreation Centre Rupandehi",
    ne: "ज्येष्ठ नागरिक मिलन केन्द्र रुपन्देही",
  },
  "brand.sub": {
    en: "Shri Ramkrishna Namdev Samaj Sansthan",
    ne: "श्री रामकृष्ण नामदेव समाज संस्थान",
  },
  "nav.home": { en: "Home", ne: "होम" },
  "nav.about": { en: "About", ne: "परिचय" },
  "nav.members": { en: "Members", ne: "सदस्य" },
  "nav.members.Founding": { en: "Founding Members", ne: "संस्थापक सदस्य" },
  "nav.members.Lifetime": { en: "Lifetime Members", ne: "आजीवन सदस्य" },
  "nav.members.Senior-Citizen": {
    en: "Senior-Citizen Members",
    ne: "सेवाग्राही सदस्य",
  },
  "nav.members.donation": { en: "Endowment Donor Members", ne: "अक्षकोष दाता सदस्य" },
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
    en: "The establishment of the Senior Citizens Recreation Center, Shringeshwardham, Rupandehi aims to address the challenges faced by senior citizens and provide them with a supportive environment for their physical, mental, and psychological well-being. In response to the growing sense of loneliness experienced by the elderly in modern society, the center seeks to bridge the generational gap and promote the exchange of knowledge, skills, and experiences.Recognizing the inherent rights of senior citizens to dignity, respect, and care in old age, this initiative strives to create a harmonious space that fosters mutual understanding between generations and encourages the preservation and promotion of cultural values. Through this compassionate vision, the center envisions a prosperous nation that values and celebrates the wisdom and legacy of its elderly citizens.",
    ne: "जेष्ठ नागरिक मनोरञ्जन केन्द्र, श्रृङ्गेश्वरधाम, रुपन्देही” को स्थापनाले जेष्ठ नागरिकहरूले सामना गर्ने चुनौतीहरूलाई सम्बोधन गर्न र उनीहरूलाई शारीरिक, मानसिक र मनोवैज्ञानिक कल्याणको लागि सहयोगी वातावरण उपलब्ध गराउन खोजेको छ। आधुनिक समाजमा वरिष्ठहरूले अनुभव गरेको बढ्दो एक्लोपनको प्रतिक्रियामा, केन्द्रले पुस्ताको खाडललाई पुल गर्ने र ज्ञान, सीप र अनुभवहरूको स्थानान्तरणलाई प्रवर्द्धन गर्ने लक्ष्य राखेको छ। वृद्धावस्थामा ज्येष्ठ नागरिकको मर्यादा, सम्मान र हेरचाहको प्राकृतिक अधिकारलाई मान्यता दिँदै, पहलले पुस्ताहरू बीचको आपसी समझदारीलाई बढावा दिँदै सांस्कृतिक मूल्यहरूको संरक्षण र प्रवर्द्धन गर्ने सामंजस्यपूर्ण ठाउँ सिर्जना गर्ने प्रयास गर्दछ। यस दयालु दृष्टिकोण मार्फत, केन्द्रले एक समृद्ध राष्ट्रको परिकल्पना गर्दछ जसले आफ्ना वृद्ध नागरिकहरूको बुद्धि र विरासतलाई मूल्याङ्कन गर्दछ र मनाउँछ |",
  },
  "activities.title": { en: "Our Activities", ne: "हमारी गतिविधियाँ" },
  "leaders.title": { en: "Our Leadership", ne: "हमारे नेतृत्व" },
  "core.title": { en: "Core Management Team", ne: "कोर मैनेजमेंट टीम" },
  "staff.title": { en: "Office Staff", ne: "ऑफिस स्टाफ" },
  "dpmt.title": { en: "Daily Program Management Team (DPMT)", ne: "दैनिक कार्यक्रम व्यवस्थापन उप-समिति (DPMT)" },
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
    en: "The establishment of the Senior Citizens Recreation Center, Shringeshwardham, Rupandehi aims to address the challenges faced by senior citizens and provide them with a supportive environment for their physical, mental, and psychological well-being. In response to the growing sense of loneliness experienced by the elderly in modern society, the center seeks to bridge the generational gap and promote the exchange of knowledge, skills, and experiences.Recognizing the inherent rights of senior citizens to dignity, respect, and care in old age, this initiative strives to create a harmonious space that fosters mutual understanding between generations and encourages the preservation and promotion of cultural values. Through this compassionate vision, the center envisions a prosperous nation that values and celebrates the wisdom and legacy of its elderly citizens.",
    ne: "जेष्ठ नागरिक मनोरञ्जन केन्द्र, श्रृङ्गेश्वरधाम, रुपन्देही” को स्थापनाले जेष्ठ नागरिकहरूले सामना गर्ने चुनौतीहरूलाई सम्बोधन गर्न र उनीहरूलाई शारीरिक, मानसिक र मनोवैज्ञानिक कल्याणको लागि सहयोगी वातावरण उपलब्ध गराउन खोजेको छ। आधुनिक समाजमा वरिष्ठहरूले अनुभव गरेको बढ्दो एक्लोपनको प्रतिक्रियामा, केन्द्रले पुस्ताको खाडललाई पुल गर्ने र ज्ञान, सीप र अनुभवहरूको स्थानान्तरणलाई प्रवर्द्धन गर्ने लक्ष्य राखेको छ। वृद्धावस्थामा ज्येष्ठ नागरिकको मर्यादा, सम्मान र हेरचाहको प्राकृतिक अधिकारलाई मान्यता दिँदै, पहलले पुस्ताहरू बीचको आपसी समझदारीलाई बढावा दिँदै सांस्कृतिक मूल्यहरूको संरक्षण र प्रवर्द्धन गर्ने सामंजस्यपूर्ण ठाउँ सिर्जना गर्ने प्रयास गर्दछ। यस दयालु दृष्टिकोण मार्फत, केन्द्रले एक समृद्ध राष्ट्रको परिकल्पना गर्दछ जसले आफ्ना वृद्ध नागरिकहरूको बुद्धि र विरासतलाई मूल्याङ्कन गर्दछ र मनाउँछ |",
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
