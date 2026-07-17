export interface TemplateItem {
  id: string;
  content: string;
  notes?: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  icon: string;
  items: TemplateItem[];
}

export const chatTemplates: TemplateSection[] = [
  {
    id: "opening",
    title: "Opening",
    icon: "👋",
    items: [
      { id: "introduction", content: "Hello, [Client's Name]. Thank you for contacting Meta support. I am James. For your reference, your case ID is {case_id}. To get started, please tell me a bit more about what you're experiencing.", notes: "Introduction" },
      { id: "case-owned", content: "Hello, [Client's Name]. I am James from Meta Support. Thank you for your patience. I am now going to take over this case from our chatbot assistant. One moment while I review the previous conversation and your account.", notes: "Case Owned by bot" },
      { id: "ask-name", content: "Hi, my name is Agent_name. Your case ID is {case_id}. Thank you for contacting Meta Support. For better understanding, could you provide your name?", notes: "If name is not visible" },
      { id: "returning-customer", content: "Hi again! Let me know when you're ready to pick up where we left off", notes: "Returning customer" },
      { id: "describe-issue", content: "In order for me to best assist you, can you please describe the issue you are having? If you could include as much detail as possible, it will allow me to resolve your issue as quickly as possible.", notes: "Relevant Details" }
    ]
  },
  {
    id: "timing",
    title: "Issue Timing",
    icon: "⏰",
    items: [
      { id: "timing-1", content: "When did you start noticing this issue?" },
      { id: "timing-2", content: "Are you able to provide the exact date you started noticing this issue?" }
    ]
  },
  {
    id: "issue-handling",
    title: "Issue Handling",
    icon: "🔍",
    items: [
      { id: "issue-confirm", content: "I see you need assistance with [issue type]. Is this correct?" },
      { id: "issue-understood", content: "If I understood you, your issue is [Issue type], is that correct?" },
      { id: "Paraphasing-1", content: "I understand that you're reporting an [client's concern/request]. Did I get it right?", notes: "Paraphasing 1" },
      { id: "Paraphasing-2", content: "Let me make sure I've got this right. Your requesting [client's concern/request].", notes: "Paraphasing 2" },
      { id: "hacked-confirm", content: "I understand that you're reporting a hacked account. Did I get it right?", notes: "Hacked account" },
      { id: "password-phone", content: "I understand that you're reporting a password issue and a new phone number. Did I get it right?", notes: "Password + phone" },
      { id: "password-email", content: "I understand that you're reporting a password issue and a new email address. Did I get it right?", notes: "Password + email" },
      { id: "password-reset-link", content: "I understand that you're reporting an issue with your password reset link. Did I get that right?", notes: "Password reset link" }
    ]
  },
  {
    id: "empathy",
    title: "Empathy & Assurance",
    icon: "💙",
    items: [
      { id: "empathy-1", content: "I understand your frustration, and I'll do my best to help. Let me review your account first." },
      { id: "empathy-2", content: "I'm here to help you out. Let me take a look at your account and see what I can do for you." },
      { id: "option-3", content: "I know how important your account is to you, let's work on getting this sorted." },
      { id: "option-4", content: "I can imagine this is inconvenient, and I'm here to help you through it." },
      { id: "option-5", content: "I'm sorry to hear you're experiencing this. We take these matters seriously and will work to address the issue." },
      { id: "option-6", content: "I hear your concern, and you're absolutely right to check on this. I'll make sure everything is handled properly for you." },
      { id: "option-7", content: "I know this can be frustrating, especially if you've tried multiple times already. Let's go through it together step-by-step." }
    ]
  },
  {
    id: "power-scripts",
    title: "Power scripts",
    icon: "🔑",
    items: [
      { id: "option-1", content: "I understand that you're reporting an [client's concern/request].", notes: "Option 1" },
      { id: "option-2", content: "I appreciate the confirmation, [Client's Name].", notes: "Option 2" },
      { id: "option-3", content: "Awesome, [Client's Name]! Thanks for confirming the details.", notes: "Option 3" }
    ]
  },
  {
    id: "investigation",
    title: "Investigation",
    icon: "🔬",
    items: [
      { id: "wait-time", content: "Kindly allow me 3-5 minutes while I look into this. Thank you." },
      { id: "proceed", content: "Thank you for your submission; I'll proceed with the next steps." },
      { id: "agc-account-only", content: "Unfortunately, I can only assist with the FB/IG account (name visible on AGC) through this chat support. If you require assistance with another account, you will need to raise a separate request from that specific account." },
      { id: "confirm-account", content: "To confirm, are you seeking support for the Facebook/IG account, < Account name>?" },
      { id: "regain-then-delete", content: "I can help you regain access to your account once I verify your identity. Once you gain access to your account, you will be able to update your number/ delete your account by yourself. If that's okay, would you like to proceed?\n\n\n\n\nPermanently Delete Your Facebook Account: https://www.facebook.com/help/224562897555674/\n\n\n\n\nPermanently delete or deactivate your Instagram account: https://help.instagram.com/139886812848894" },
      { id: "separate-account-security", content: "For security purposes, we are unable to assist you on a separate account. Please reach out via (Facebook/Instagram).com/hacked through your other account for assistance." }
    ]
  },
  {
    id: "compromised",
    title: "Compromised Account",
    icon: "⚠️",
    items: [
      { id: "compromised-yes", content: "Thank you for your patience while I researched this issue. There does seem to be some suspicious activity on your account that suggests there was a compromise. To regain access to your account, I will need to verify the owner of this account.", notes: "If compromised" },
      { id: "compromised-no", content: "Thank you for your patience while I researched this issue. To regain access to your account, I will need to verify the owner of this account.", notes: "If not compromised" }
    ]
  },
  {
    id: "ownership",
    title: "Ownership Verification",
    icon: "🔐",
    items: [
      { id: "fb-app", content: "The quickest and most secure way to confirm ownership of this account is through the Facebook app. You do not need to log in to complete this process. Do you have the app installed on your phone?", notes: "Facebook case" },
      { id: "ig-app", content: "The quickest way is via the Instagram app. Is it installed on your phone?", notes: "Instagram case" },
      { id: "previous-device", content: "For the next verification question, can you provide any previous devices you used to log into your (Facebook/Instagram) account? Please provide the exact device model type (i.e. iPhone 14 Pro Max) tablet, or computer.", notes: "Previous device" }
    ]
  },
  {
    id: "selfie",
    title: "Selfie Verification",
    icon: "🤳",
    items: [
      { id: "selfie-mobile", content: "To start the selfie verification process please click this link and follow the instructions provided in the app. Let me know when you have completed this process.", notes: "Mobile" },
      { id: "selfie-desktop", content: "Scan this QR code with your phone camera to start the selfie verification process. Please follow the instructions provided in the app. Let me know when you have completed this process.", notes: "Desktop" }
    ]
  },
  {
    id: "device",
    title: "Device Confirmation",
    icon: "📱",
    items: [
      { id: "device-check", content: "Could you please confirm the device you are using to chat with us? Is it a mobile phone or a desktop?" },
      { id: "no-phone-facebook", content: "I understand you don't have a phone to complete this step. In order to record the selfie video, you will need to use a phone with the Facebook app installed.", notes: "No phone" },
      { id: "borrow-phone", content: "Could you borrow a phone from a friend or family member to complete this step? Don't worry, you don't need to log in to your Facebook account on their phone to record the video.", notes: "Borrow phone" },
      { id: "any-phone-qr", content: "You can use any phone with the Facebook app installed on it to scan the QR code. Don't worry, you don't need to log in to your Facebook account on that phone to record the video.", notes: "Any phone QR" },
      { id: "update-app", content: "Encourage you to go to the App Store (for iPhone) or Google Play Store (for Android) and update the Facebook app to the latest version.", notes: "Update app" }
    ]
  },
  {
    id: "script-after-video",
    title: "Script After Submitting Video",
    icon: "🎬",
    items: [
      { id: "video-review", content: "Thank you for completing the selfie verification. Please give me a moment while I verify your identity." },
      { id: "passed-first", content: "Good news, It looks like you passed our first verification point." },
      { id: "second-verify", content: "For the second form of verification, we will need a previous email or phone number that was associated with either a Facebook or an Instagram account that you still have access to." },
      { id: "verification-code-sent", content: "I've just sent a verification code to the email address you provided. Could you please share the code with me once you receive it?" },
      { id: "code-thanks", content: "Thank you for providing that code." },
      { id: "verified", content: "Good news. We were able to verify that you are the owner of this account and we can proceed with securing your account." },
      { id: "contact-verify", content: "Thank you for providing that. One moment while I verify these contact points.", notes: "User will give an email, phone number OR both" },
      { id: "insufficient-photos", content: "Unfortunately, your account does not have sufficient profile photos on file for us to complete the selfie verification process." },
      { id: "selfie-no-match", content: "Unfortunately, the selfie you provided did not match the photo associated with your account." }
    ]
  },
  {
    id: "video-upload",
    title: "Selfie Video Upload",
    icon: "🎥",
    items: [
      { id: "video-instructions", content: "Please record a video of yourself. To make sure your video is approved, follow these rules:\n\n• Write down this code. The code must be handwritten. You can write the code on a piece of paper, on your hand, on a napkin, etc.\n\n{auth_code}\n\n• Make sure that your whole face is visible.\n\n• Show head movement by tilting your head to the left, to the right and up and down.\n\n• Show hand movement by moving the code to the left, to the right and up and down.\n\n• Make sure no one else appears in the video." }
    ]
  },
  {
    id: "id-rejected",
    title: "ID Not Accepted",
    icon: "❌",
    items: [
      { id: "id-not-accepted", content: "Thank you for your patience while the system reviewed your ID. Unfortunately, I am unable to complete the authentication process based on the ID you have provided, so I won't be able to grant access to your account. Please refer to the Facebook Help Center article here for more information: https://www.facebook.com/help" }
    ]
  },
  {
    id: "verification",
    title: "Account Verification",
    icon: "✅",
    items: [
      { id: "previous-email", content: "Could you provide your previous email address or phone number used to log in and still accessible?" }
    ]
  },
  {
    id: "id-check",
    title: "ID Check",
    icon: "🪪",
    items: [
      { id: "id-request", content: "The next step is to verify your identity by submitting an ID via the Facebook app. To complete this step, you will need to submit one of the following types of ID: Passport, Driver's license and National ID" },
      { id: "id-link", content: "I'm sending you a link to complete an ID check. Please click the link and follow the instructions provided. If you have any questions or need assistance, I'm here to help." },
      { id: "id-qr-scan", content: "Kindly scan the QR code and follow the link provided. It will open the Facebook app and guide you through the ID review process.", notes: "QR scan" },
      { id: "id-submitted", content: "Thank you for submitting your ID. I will review your document and keep you updated." },
      { id: "id-verification-wait", content: "Thank you for submitting the ID. Please allow us 3 to 5 minutes while your ID is being verified.", notes: "Wait for verification" },
      { id: "id-internal-review", content: "Thank you for your patience. The ID is now being reviewed by our dedicated internal team. I will convert this support case to Email and inform you once I have an update for you. What is an email address I can use to contact you?", notes: "Internal review" },
      { id: "id-pause-48h", content: "I can pause this chat and you can come back any time in 48h once you are ready to submit your ID. Is that okay?", notes: "Pause 48h" }
    ]
  },
  {
    id: "2fa",
    title: "Two-Factor Authentication",
    icon: "🔑",
    items: [
      { id: "2fa-clear", content: "To clear 2FA, a selfie video security check is mandatory. Wait while a QR code or link is generated.", notes: "Ask only if 2FA is not cleared or phone/email issues exist" }
    ]
  },
  {
    id: "pre-sua-email",
    title: "Get New Email Before SUA",
    icon: "📩",
    items: [
      { id: "new-email-request", content: "Can you provide an email that is NOT associated with an existing Facebook or Instagram account?" }
    ]
  },
  {
    id: "out-of-scope",
    title: "Out-of-Scope Requests",
    icon: "🚫",
    items: [
      { id: "violation", content: "Unfortunately, I am unable to assist with issues you are having with your account. Please visit the help center for next steps. \n\nFacebook - https://www.facebook.com/help/103873106370583/ \nInstagram - https://help.instagram.com/", notes: "Violation" },
      { id: "separate-account", content: "*FIRST, CONFIRM IF THEY ARE WANTING ASSISTANCE ON A DIFFERENT ACCOUNT*\nFor security purposes, we are unable to assist you on a separate account. Please reach out via (Facebook/Instagram).com/hacked through your other account for assistance. If additional assistance is needed, please refer to our help center.\n\nFacebook - https://www.facebook.com/help\nInstagram - https://www.instagram.com/hacked/", notes: "Additional/Separate account(s)" },
      { id: "delete-account", content: "We are unable to support this request through this channel. Please reference this article for further assistance:\n\nFacebook - https://www.facebook.com/help/224562897555674/\nInstagram - https://help.instagram.com/139886812848894/?helpref=search&query=delete%20account%20permanently", notes: "How do I delete my account?" },
      { id: "deceased-relative", content: "Unfortunately, we can only assist with regaining account access with the account owner. Please reference this memorialization article for further guidance.\n\nFacebook - https://www.facebook.com/help/1111566045566400/\nInstagram - https://help.instagram.com/1401073473505873/", notes: "Trying to access account for deceased relative" }
    ]
  },
  {
    id: "cant-reproduce",
    title: "Can't Reproduce",
    icon: "🚫",
    items: [
      { id: "general-case", content: "We were unable to reproduce the issue on our end. Please visit the links below for further troubleshooting steps and guidance.\n\nFacebook Help Center: https://www.facebook.com/help\nInstagram Help Center: https://help.instagram.com/", notes: "General Case" }
    ]
  },
  {
    id: "abandoned",
    title: "Abandoned Chat",
    icon: "⏳",
    items: [
      { id: "still-connected", content: "Are we still connected?" },
      { id: "no-response", content: "Since I haven't heard back, I'll end our chat for today. We'd be happy to provide further assistance." },
      { id: "away", content: "Since I haven't heard back, I'm going to pause this chat for now. You can send a message whenever you're ready to continue and we will get back to you" }
    ]
  },
  {
    id: "known-issues",
    title: "Known Product Issues",
    icon: "🐛",
    items: [
      { id: "web-not-app", content: "After reviewing your case, I've identified that the problem you're experiencing is due to a known product issue. At this time, there are no support-side actions we can take to address the issue directly. Our engineering team is aware of the bug and is actively working on a fix. While we don't have an exact timeline for when it will be fixed, please rest assured that this is a priority for us. We recommend waiting a few days and then trying to log in again as you normally would.", notes: "Login in the web but not in the app" }
    ]
  },
  {
    id: "resolution-confirmation",
    title: "Resolution Confirmation",
    icon: "✅",
    items: [
      { id: "confirmation-password-email", content: "Can you confirm if you received the reset password link in your email and whether you were able to successfully complete the password reset process, please?", notes: "Confirm password received" },
      { id: "account-secure", content: "Your account is now secure. You should be receiving an email to [NEW email provided] with a password reset link. Be sure to log into your (Facebook/Instagram) account with this new email address. Let me know if you run into any issues.", notes: "Account secure" },
      { id: "account-secure-fb", content: "Your account is now secure. You should be receiving an email with a password reset link. Be sure to log into your Facebook account with this new email address. Let me know if you run into any issues.", notes: "Account secure (Facebook)" },
      { id: "cr-glad-to-help", content: "I'm glad we were able to help you today. I'm going to end our chat session, but please contact us again if you have any other questions.", notes: "CR" },
      { id: "cr-pending-response", content: "We have provided a resolution to your case. If you require any additional support, please return to the chat feature to continue the conversation. This case will remain open for up to 48 hours. If no response is received, it will be automatically closed.", notes: "CR Pending Response" }
    ]
  },
  {
    id: "gain-agreement",
    title: "Gain Agreement",
    icon: "💙",
    items: [
      { id: "option-1", content: "Have I covered all your questions today?" },
      { id: "option-2", content: "May I confirm if I was able to address your issue today?" },
      { id: "option-3", content: "Is there anything else I can help you with?" },
      { id: "option-4", content: "If you do not have any other questions, we can wrap up the call." }
    ]
  },
  {
    id: "closing",
    title: "Closing",
    icon: "👋",
    items: [
      { id: "technical-issue", content: "The process cannot proceed now due to a technical issue. To make sure you still get help as quickly as possible, please open a new support case and we'll be glad to continue assisting you there. You can reach out to us through our help center: https://www.facebook.com/help\n\nThank you for understanding.", notes: "Technical Issues" },
      { id: "resolved-happy", content: "I'm glad to hear you were able to regain access to your account. I will now be closing this case. Have a good day" },
      { id: "generic-positive-scenario-password", content: "We are pleased to have assisted you with your inquiry today. To summarize, we discussed that you were experiencing issues resetting your password. We authenticated the ownership of your account and provided you with a password reset link. For additional information, you can refer to these helpful resources: \nhttps://www.facebook.com/help/\nhttps://help.instagram.com/\nI will now conclude this chat. If you have any further concerns in the future, please don't hesitate to reach out to us again. Thank you for contacting Meta Support, and have a wonderful day ahead!", notes: "Generic Positive Scenario Password" },
      { id: "generic-positive-scenario-2FA", content: "We are pleased to have assisted you with your inquiry today. To summarize, you reached out regarding difficulties with Two-Factor Authentication (2FA) on your account. We verified your account ownership and provided guidance to help you regain access and address the 2FA issue.\nFor further information, you may find these resources helpful:\nhttps://www.facebook.com/help/\nhttps://help.instagram.com/\nI will now conclude this chat. If you have any additional questions or concerns in the future, please do not hesitate to contact us again. Thank you for contacting Meta Support, and have a wonderful day ahead!", notes: "Generic Positive Scenario 2FA" },
      { id: "generic-negative-scenario-password", content: "To recap, you contacted us about a password-related issue, and we provided guidance to help you regain access to your account. At this time, we're unable to complete the requested assistance within this session.\nFor further assistance and information, please refer to these helpful resources:\nhttps://www.facebook.com/help/\nhttps://help.instagram.com/\nI will now end this chat. If you have other concerns in the future, please feel free to contact us again. Thank you for contacting Meta Support today, and have a great day ahead.", notes: "Generic Negative Scenario Password" }
    ]
  },
  {
    id: "email-model",
    title: "Email Template",
    icon: "📧",
    items: [
      { id: "email-template", content: "Hi User,\n\nThank you for reaching out to us. We're glad we could assist you with your recent inquiry.\n\nIf you have any further questions or need additional support, please don't hesitate to reply to this email or contact us through our support portal.\n\nBest regards,\n\nThanks,\nAgent_name" }
    ]
  },
  {
    id: "escalation",
    title: "Escalation",
    icon: "🔧",
    items: [
      { id: "transfer-to-email", content: "Due to the complexity of your issue, I will need more time for further investigations. I can move this conversation over to email so that we can complete this process via email. What is a good email to contact you through?", notes: "Transfer to email" },
      { id: "email-message", content: "Hi [user],\n\nI apologize for the inconvenience. I have to escalate this issue to a specialized support channel for further review. I will write back as soon as I get a resolution or an update.", notes: "Email Message" }
    ]
  },
  {
    id: "auth-failed",
    title: "Authentication Failed",
    icon: "🔒",
    items: [
      { id: "auth-failed-msg", content: "Unfortunately I am unable to complete the authentication process based on the information you have provided, so I won't be able to grant access to your account.\n\nPlease refer to the Facebook Help Center article here for more information:\nhttps://www.facebook.com/help" }
    ]
  }
];

export const leftSidebarButtons = [
  { label: "Not Comp. CR", symbol: "▸", message: "Thank you for your patience while I researched this issue. To regain access to your account, I will need to verify the owner of this account." },
  { label: "Compromised CR", symbol: "▸", message: "Thank you for your patience while I researched this issue. There does seem to be some suspicious activity on your account that suggests there was a compromise. To regain access to your account, I will need to verify the owner of this account." },
  { label: "FB App", symbol: "◇", message: "The quickest and most secure way to confirm ownership of this account is through the Facebook app. You do not need to log in to complete this process. Do you have the app installed on your phone?" },
  { label: "IG App", symbol: "◆", message: "The quickest way is via the Instagram app. Is it installed on your phone?" },
  { label: "Device Conf.", symbol: "●", message: "On the device you have with our chat open, do you have access to the camera? Is it mobile or desktop?" },
  { label: "Mobile", symbol: "<", message: "To start the selfie verification process please click this link and follow the instructions provided in the app. Let me know when you have completed this process." },
  { label: "Desktop", symbol: "◉", message: "Scan this QR code with your phone camera to start the selfie verification process. Please follow the instructions provided in the app. Let me know when you have completed this process." },
  { label: "ID Reject", symbol: "!", message: "Thank you for your patience while the system reviewed your ID. Unfortunately, I am unable to complete the authentication process based on the ID you have provided." },
  { label: "Invalid KBA", symbol: "!", message: "Unfortunately I am unable to complete the authentication process based on the information you have provided, so I won't be able to grant access to your account. Please refer to the Facebook Help Center article here for more information: https://www.facebook.com/help" },
  { label: "Can't Reproduce", symbol: "!", message: "I've reviewed your case and attempted to reproduce the issue you described, but I'm unable to replicate it on my end. Could you provide more details about when this occurs and any specific steps you take before seeing the problem?" },
  { label: "Email SUA", symbol: "◎", message: "To help secure your account, I'll need a new email address from you. Please provide an email you can access that isn't currently linked to any Facebook or Instagram account." },
  { label: "email", symbol: "▸", message: "What email address or phone number have you previously used to log into your Facebook account and still have access to? I am going to send a five-digit code to (Phone number/email address). Please respond to this chat with that code." }
];

export const rightSidebarButtons = [
  { label: "Confirmation", symbol: "!", message: "Awesome! Thanks for confirming the details." },
  { label: "Greeting", symbol: "◉", message: "Hi, [Client's Name]. Thank you for contacting Meta Support. Your case ID is {case_id}. My name is Agent_name and I'll be happy to assist you today. Please tell me more about the issue." },
  { label: "No Name", symbol: "○", message: "Hi, my name is Agent_name. Your case ID is {case_id}. Thank you for contacting Meta Support. For better understanding, could you provide your name?" },
  { label: "Abandoned", symbol: "◷", message: "Since I haven't heard back, I'm going to pause this chat for now. You can send a message whenever you're ready to continue and we will get back to you" },
  { label: "Issue", symbol: "?", message: "If I understood you, your issue is [Issue type], is that correct?" },
  { label: "2FA", symbol: "○", message: "I understand that you're reporting an issue or request related to two-factor authentication (2FA). Did I get that right?" },
  { label: "Hacked", symbol: "☠", message: "I understand that you're reporting a hacked account. Did I get it right?" },
  { label: "Password", symbol: "◇", message: "I understand that you're reporting a password issue and a new email address. Did I get it right?" },
  { label: "Empathy", symbol: "", message: "I'm here to help you out. Let me take a look at your account and see what I can do for you." },
  { label: "Not Frust.", symbol: "▲", message: "Thank you for the detailed information. I can definitely look into this issue for you. One moment while I investigate your account." },
  { label: "Timing", symbol: "◐", message: "When did you start noticing this issue?" },
  { label: "pause-inves", symbol: "○", message: "Thanks for sharing all this information, [Client's Name]. We are now looking into it. Please keep the chat open while we investigate." },
  { label: "Pause", symbol: "▢", message: "Kindly allow me 3–5 minutes while I look into this. Thank you." },
  { label: "Connected?", symbol: "◯", message: "May I know if we are still connected?" }
];

export const quickNavButtons = [
  { sectionId: "script-after-video", label: "Script", icon: "🎬" },
  { sectionId: "id-check", label: "ID check", icon: "💳" },
  { sectionId: "case-info-checklist", label: "Checklist", icon: "📋" }
];

export const agents = ["James"];
