import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
export class DateUtil {
    static covertDateToString(date: Date): string {
        return `${date.getFullYear()}-${StringUtil.prefixZero(date.getMonth() + 1)}-${StringUtil.prefixZero(date.getDate())}`;
    }

    static covertStringToDate(dateStr: string): Date | string {
        if (dateStr) {
            const [year, month, day] = dateStr.split('-');
            return new Date(+year, (+month) - 1, +day);
        }
        return dateStr;
    }
}

export class StringUtil {
    static prefixZero(input: string | number): string {
        if (typeof input === 'number') input = `${input}`;
        if (input && input.length < 2) return `0${input}`;
        return input;
    }
}

export class MessageUtil {
    private static messageBehaviorSubject = new BehaviorSubject<null | string>(null);
    static message$ = this.messageBehaviorSubject.asObservable();

    static sendMessage(message: string | null): void {
        this.messageBehaviorSubject.next(message);
    }
}

export class ResponseHandler {
    static errorHandler(messageSrv: MessageService, error: any): never {
        messageSrv.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
        throw error;
    }
}

