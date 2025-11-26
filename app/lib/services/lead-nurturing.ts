import { Resend } from 'resend';
import twilio from 'twilio';

const resend = new Resend(process.env.RESEND_API_KEY || "placeholder-resend-key");
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

interface LeadData {
  fullName: string;
  email: string;
  phone?: string;
  primaryFocus: string;
  investmentLevel: string;
  spiritualOpenness: 'high' | 'moderate' | 'low';
  assessmentScore?: number;
  leadSource: string;
}

export class LeadNurturingService {
  // Immediate follow-up after assessment
  static async initiateAssessmentFollowUp(leadData: LeadData, aiGuidance: string) {
    try {
      // Send immediate email with results
      await this.sendAssessmentResultsEmail(leadData, aiGuidance);

      // Schedule SMS follow-up if phone provided
      if (leadData.phone) {
        await this.sendImmediateSMS(leadData);
        // Schedule 24-hour follow-up SMS
        setTimeout(() => this.send24HourFollowUpSMS(leadData), 24 * 60 * 60 * 1000);
      }

      // Trigger appropriate nurture sequence based on investment level
      await this.triggerNurtureSequence(leadData);

      console.log('Assessment follow-up initiated for:', leadData.email);
    } catch (error) {
      console.error('Failed to initiate assessment follow-up:', error);
    }
  }

  // Send assessment results email
  private static async sendAssessmentResultsEmail(leadData: LeadData, aiGuidance: string) {
    const emailContent = this.getAssessmentEmailContent(leadData, aiGuidance);

    await resend.emails.send({
      from: 'Lorenzo DC <lorenzo@lorenzodc.com>',
      to: leadData.email,
      subject: `${leadData.fullName}, Your Strategic Clarity Analysis is Ready`,
      html: emailContent
    });
  }

  // Immediate SMS after assessment
  private static async sendImmediateSMS(leadData: LeadData) {
    if (!leadData.phone) return;

    const message = this.getImmediateSMSContent(leadData);

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: leadData.phone
    });
  }

  // 24-hour follow-up SMS
  private static async send24HourFollowUpSMS(leadData: LeadData) {
    if (!leadData.phone) return;

    const message = this.get24HourSMSContent(leadData);

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: leadData.phone
    });
  }

  // Trigger appropriate nurture sequence
  private static async triggerNurtureSequence(leadData: LeadData) {
    const sequenceType = this.determineNurtureSequence(leadData);

    switch (sequenceType) {
      case 'high_value':
        await this.startHighValueSequence(leadData);
        break;
      case 'ministry_focused':
        await this.startMinistrySequence(leadData);
        break;
      case 'business_strategic':
        await this.startBusinessSequence(leadData);
        break;
      case 'investor_prospect':
        await this.startInvestorSequence(leadData);
        break;
      default:
        await this.startGeneralSequence(leadData);
    }
  }

  // Determine nurture sequence type
  private static determineNurtureSequence(leadData: LeadData): string {
    if (leadData.investmentLevel.includes('$50K+') || leadData.investmentLevel.includes('Institutional')) {
      return 'high_value';
    }
    if (leadData.primaryFocus.includes('Ministry') || leadData.spiritualOpenness === 'high') {
      return 'ministry_focused';
    }
    if (leadData.primaryFocus.includes('Investment') || leadData.investmentLevel.includes('$24,997')) {
      return 'investor_prospect';
    }
    if (leadData.primaryFocus.includes('Business') || leadData.primaryFocus.includes('Organizational')) {
      return 'business_strategic';
    }
    return 'general';
  }

  // High-Value Prospect Sequence
  private static async startHighValueSequence(leadData: LeadData) {
    // Day 1: Personal video message
    setTimeout(() => this.sendHighValueEmail1(leadData), 2 * 60 * 60 * 1000); // 2 hours
    // Day 3: Case study and strategy call offer
    setTimeout(() => this.sendHighValueEmail2(leadData), 3 * 24 * 60 * 60 * 1000); // 3 days
    // Day 7: Personal reach-out from Lorenzo
    setTimeout(() => this.sendHighValueEmail3(leadData), 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  // Ministry-Focused Sequence
  private static async startMinistrySequence(leadData: LeadData) {
    // Day 1: Prophetic business integration guide
    setTimeout(() => this.sendMinistryEmail1(leadData), 2 * 60 * 60 * 1000);
    // Day 5: TPC Ministries community invitation
    setTimeout(() => this.sendMinistryEmail2(leadData), 5 * 24 * 60 * 60 * 1000);
    // Day 10: Divine strategy coaching offer
    setTimeout(() => this.sendMinistryEmail3(leadData), 10 * 24 * 60 * 60 * 1000);
  }

  // Business Strategic Sequence
  private static async startBusinessSequence(leadData: LeadData) {
    // Day 2: Strategic implementation framework
    setTimeout(() => this.sendBusinessEmail1(leadData), 2 * 24 * 60 * 60 * 1000);
    // Day 6: Catalyst AI platform trial
    setTimeout(() => this.sendBusinessEmail2(leadData), 6 * 24 * 60 * 60 * 1000);
    // Day 12: Strategic coaching consultation
    setTimeout(() => this.sendBusinessEmail3(leadData), 12 * 24 * 60 * 60 * 1000);
  }

  // Investor Prospect Sequence
  private static async startInvestorSequence(leadData: LeadData) {
    // Day 1: Investment fund overview
    setTimeout(() => this.sendInvestorEmail1(leadData), 4 * 60 * 60 * 1000); // 4 hours
    // Day 4: Portfolio and impact metrics
    setTimeout(() => this.sendInvestorEmail2(leadData), 4 * 24 * 60 * 60 * 1000);
    // Day 8: Due diligence materials and call scheduling
    setTimeout(() => this.sendInvestorEmail3(leadData), 8 * 24 * 60 * 60 * 1000);
  }

  // Email content generators
  private static getAssessmentEmailContent(leadData: LeadData, aiGuidance: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #B8860B, #00A8CC); padding: 30px; text-align: center; color: white; }
        .content { background: #f8f9fa; padding: 30px; }
        .guidance { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #B8860B; }
        .cta { background: #B8860B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${leadData.fullName}, Your Strategic Clarity Analysis</h1>
          <p>Divine Strategy + Systematic Implementation</p>
        </div>

        <div class="content">
          <p>Thank you for completing your Strategic Clarity Assessment. Based on your responses, I've generated personalized guidance that integrates spiritual discernment with systematic implementation.</p>

          <div class="guidance">
            <h2>Your Personalized Strategic Guidance:</h2>
            ${aiGuidance.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}
          </div>

          <p>This analysis combines advanced spiritual intelligence with strategic consulting to provide guidance that honors both your calling and practical implementation needs.</p>

          <h3>Ready for Your Next Step?</h3>
          <p>Based on your assessment, I recommend we schedule a Strategic Clarity Session to dive deeper into your specific situation and create a systematic implementation plan.</p>

          <a href="https://calendly.com/lorenzo-theglobalenterprise/discovery-call?utm_source=assessment_email" class="cta">Schedule Strategic Session</a>

          <p>Questions? Simply reply to this email - I personally read and respond to every message.</p>

          <p>Blessings and Strategic Clarity,<br>
          <strong>Lorenzo Daughtry-Chambers</strong><br>
          <em>Divine Strategy + Systematic Implementation</em></p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  private static getImmediateSMSContent(leadData: LeadData): string {
    if (leadData.spiritualOpenness === 'high') {
      return `${leadData.fullName.split(' ')[0]}, your Strategic Clarity Analysis is ready! I sense the Lord is positioning you for breakthrough. Check your email for personalized guidance. - Lorenzo`;
    } else if (leadData.spiritualOpenness === 'moderate') {
      return `${leadData.fullName.split(' ')[0]}, your strategic analysis reveals some powerful insights about your calling and timing. Check your email for the full guidance. - Lorenzo`;
    } else {
      return `${leadData.fullName.split(' ')[0]}, your strategic clarity analysis is complete. The insights about your leadership patterns and optimal timing are in your email. - Lorenzo`;
    }
  }

  private static get24HourSMSContent(leadData: LeadData): string {
    return `${leadData.fullName.split(' ')[0]}, did you have a chance to review your Strategic Clarity Analysis? I'm curious about your thoughts on the guidance. Ready to discuss implementation? - Lorenzo`;
  }

  // Placeholder methods for sequence emails (implement based on your content strategy)
  private static async sendHighValueEmail1(leadData: LeadData) { /* Implementation */ }
  private static async sendHighValueEmail2(leadData: LeadData) { /* Implementation */ }
  private static async sendHighValueEmail3(leadData: LeadData) { /* Implementation */ }
  private static async sendMinistryEmail1(leadData: LeadData) { /* Implementation */ }
  private static async sendMinistryEmail2(leadData: LeadData) { /* Implementation */ }
  private static async sendMinistryEmail3(leadData: LeadData) { /* Implementation */ }
  private static async sendBusinessEmail1(leadData: LeadData) { /* Implementation */ }
  private static async sendBusinessEmail2(leadData: LeadData) { /* Implementation */ }
  private static async sendBusinessEmail3(leadData: LeadData) { /* Implementation */ }
  private static async sendInvestorEmail1(leadData: LeadData) { /* Implementation */ }
  private static async sendInvestorEmail2(leadData: LeadData) { /* Implementation */ }
  private static async sendInvestorEmail3(leadData: LeadData) { /* Implementation */ }
  private static async startGeneralSequence(leadData: LeadData) { /* Implementation */ }
}