import { environment } from "src/environments/environment";

export const Plans: PlanDetail[] = [
    {
        id: environment.production ? 'prod_TEIgSx3MHWWsaG' : 'prod_TD6FrAGsjKAIPt',
        name: 'Free',
        subscriptions: 1000,
        notifications: 10,
        ads: true,
        price: 0,
        paymentUrl: environment.production 
            ? 'https://buy.stripe.com/4gMbJ0gXA2CD7vVbep4Ni00?locked_prefilled_email='
            : 'https://buy.stripe.com/test_28E3cu0QVdC58ySapjaIM03?locked_prefilled_email='
    },
    {
        id: environment.production ? 'prod_TEIg6obzRrXLNY' : 'prod_T8Auz8GR1zK0yD',
        name: 'Plus',
        subscriptions: 2000,
        notifications: 100,
        ads: false,
        price: 5.99,
        paymentUrl: environment.production 
            ? 'https://buy.stripe.com/dRm28qdLodhh7vVfuF4Ni03?locked_prefilled_email='
            : 'https://buy.stripe.com/test_8x2fZgeHL1TnaH0dBvaIM00?locked_prefilled_email='
    },
    {
        id: environment.production ? 'prod_TEIgmTvrCtH7Nh' : 'prod_T9n2LrKP7a1aw8',
        name: 'Pro',
        subscriptions: 10000,
        notifications: 100,
        ads: false,
        price: 15.99,
        paymentUrl: environment.production 
            ? 'https://buy.stripe.com/dRmfZg22G2CD5nNaal4Ni02?locked_prefilled_email='
            : 'https://buy.stripe.com/test_6oUbJ0fLP41vdTc0OJaIM01?locked_prefilled_email='
    },
    {
        id: environment.production ? 'prod_TEIgK4mj7WYXsM' : 'prod_T9n6jlnVkNrc9x',
        name: 'Ultra',
        subscriptions: 'Ilimitado',
        notifications: 'Ilimitado',
        ads: false,
        price: 45.99,
        paymentUrl: environment.production 
            ? 'https://buy.stripe.com/5kQ6oG6iWdhh2bB0zL4Ni01?locked_prefilled_email='
            : 'https://buy.stripe.com/test_6oU6oG7fj41v3ey1SNaIM02?locked_prefilled_email='
    }
]


export function getPlanDetail(plan: string) {
    plan = plan != 'undefined' ? plan : 'free';
    return Plans.find(x => x.id == plan)!;
}

export interface PlanDetail {
    id: string;
    name: string;
    subscriptions: any;
    notifications: any;
    ads: boolean;
    price: number;
    paymentUrl: string | undefined;
}