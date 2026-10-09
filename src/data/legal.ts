export type LegalSection = { h: string; p?: string; ul?: string[]; lead?: string };
export type LegalDoc = { title: string; updated?: string; sections: LegalSection[] };

export const LEGAL: Record<'privacy' | 'terms' | 'faq', LegalDoc> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: June 2026',
    sections: [
      { h: '1. Who We Are', p: 'Isebe is a Lagos-based food brand offering authentic Nigerian cuisine for dine-in and delivery. Our app and ordering platform are operated by Isebe and powered by BeepeeLabs. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.' },
      { h: '2. Information We Collect', lead: 'When you place an order or interact with our platform, we may collect:', ul: ['Your name and contact details (phone number, WhatsApp)', 'Delivery address and location information', 'Order history and food preferences', 'Device information and usage behaviour in our app', 'Payment references (we do not store full card details)'] },
      { h: '3. How We Use Your Information', lead: 'We use your information to:', ul: ['Process and fulfil your food orders', 'Contact you via WhatsApp or phone regarding your order', 'Improve our menu, service quality, and user experience', 'Send occasional promotions (only if you have opted in)', 'Comply with applicable Nigerian laws and regulations'] },
      { h: '4. Data Sharing', p: 'We do not sell your personal data. We only share it with trusted third parties where necessary — such as our delivery partners to complete your order — and only to the extent required. All partners are required to handle your data securely.' },
      { h: '5. Data Retention', p: 'We retain your order and contact information for up to 12 months for service continuity and records purposes. You may request deletion of your data at any time by contacting us.' },
      { h: '6. Your Rights', p: 'You have the right to access, correct, or request deletion of any personal data we hold about you. To exercise these rights, please contact us via WhatsApp or email.' },
      { h: '7. Local Storage', p: 'Our app may use basic on-device storage to keep your cart and preferences. We do not use third-party tracking for advertising.' },
      { h: '8. Contact', p: 'For any privacy-related questions, please reach us at: hello@isebe.ng or via our WhatsApp order line.' },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    updated: 'Last updated: June 2026',
    sections: [
      { h: '1. Acceptance of Terms', p: 'By accessing or using the Isebe app and placing orders through our platform, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our service.' },
      { h: '2. Ordering', p: 'All orders placed through our platform are subject to availability and confirmation. By submitting an order, you are making an offer to purchase, which becomes binding once we confirm via WhatsApp. We reserve the right to refuse or cancel orders at our discretion.' },
      { h: '3. Pricing', p: 'All prices are listed in Nigerian Naira (₦) and are inclusive of applicable taxes. Prices are subject to change without prior notice. The price displayed at the time of your order is the price that applies to that transaction.' },
      { h: '4. Payment', p: 'We accept payment via bank transfer and other methods communicated at checkout. Payment must be confirmed before order preparation begins. We are not responsible for delays caused by incomplete or failed payment transfers.' },
      { h: '5. Delivery', ul: ['Estimated delivery times are 20–45 minutes depending on location and demand.', 'Delivery is available within our operational zones in Lagos.', 'We are not liable for delays caused by traffic, weather, or circumstances beyond our control.', 'You are responsible for providing an accurate delivery address.'] },
      { h: '6. Cancellations & Refunds', p: 'Orders may only be cancelled before preparation begins. Once preparation has started, cancellations are not accepted. If you receive an incorrect or damaged order, please contact us via WhatsApp within 30 minutes of delivery for resolution. Refunds, where applicable, will be processed within 3–5 business days.' },
      { h: '7. Food Allergies', p: 'Our kitchen handles common allergens including nuts, gluten, dairy, and seafood. While we take care to avoid cross-contamination, we cannot guarantee a fully allergen-free environment. Please inform us of any dietary restrictions before ordering.' },
      { h: '8. Operating Hours', p: 'We are open every day of the week, Monday to Sunday, from 8:00 AM to 10:00 PM. Orders placed outside these hours will be processed on the next available day.' },
      { h: '9. Limitation of Liability', p: 'Isebe shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability in any circumstance is limited to the value of the specific order in question.' },
      { h: '10. Changes to Terms', p: 'We reserve the right to update these Terms at any time. Continued use of our platform after changes constitutes your acceptance of the revised Terms.' },
      { h: '11. Governing Law', p: 'These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved under the jurisdiction of Nigerian courts.' },
    ],
  },
  // The web app linked to an FAQ but had no content behind it.
  // These answers are drawn from the Terms above; edit freely.
  faq: {
    title: 'FAQ',
    sections: [
      { h: 'How do I place an order?', p: 'Add dishes to your cart, then tap "Place order via WhatsApp". Your order opens as a pre-written WhatsApp message to us — your order is confirmed once we reply.' },
      { h: 'How long does delivery take?', p: 'Usually 20–45 minutes depending on your location and demand. We deliver within our operational zones in Lagos.' },
      { h: 'What are your opening hours?', p: 'Every day, 8:00 AM – 10:00 PM.' },
      { h: 'How do I pay?', p: 'By bank transfer and other methods we share when confirming your order. Payment is confirmed before we start preparing your food.' },
      { h: 'Can I cancel my order?', p: 'Only before preparation begins. If something is wrong with your order, message us on WhatsApp within 30 minutes of delivery.' },
      { h: 'I have a food allergy. Is it safe to order?', p: 'Our kitchen handles nuts, gluten, dairy and seafood, so we cannot guarantee an allergen-free meal. Please tell us about any dietary restrictions before ordering.' },
    ],
  },
};
