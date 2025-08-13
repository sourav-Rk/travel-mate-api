import nodemailer from 'nodemailer';
import { injectable } from 'tsyringe';

import { IEmailService } from '../../entities/serviceInterfaces/email-service.interface';
import { config } from '../../shared/config';
import { EVENT_EMMITER_TYPE } from '../../shared/constants';
import { eventBus } from '../../shared/eventBus';

@injectable()
export class EmailService implements IEmailService{
    private transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            service : "gmail",
            auth : {
                user : config.email.EMAIL,
                pass : config.email.PASSWORD
            }
        })
        this._registerEventListener();
    }

    private _registerEventListener() : void{
        eventBus.on(EVENT_EMMITER_TYPE.SENDMAIL,this.sendMail.bind(this))
    }

    async sendMail(to : string,subject : string, html : string) : Promise<void>{
        const mailOptions = {
            from : 'Travel Mate',
            to,
            subject,
            html 
        }
        
        await this.transporter.sendMail(mailOptions)
        console.log('email triggered')
    }
}