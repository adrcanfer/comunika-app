export const Plans: any = {
    free: {
        name: 'Free',
        subscriptions: 10,
        notifications: 10,
        ads: true,
        price: 0
    },
    plus: {
        name: 'Plus',
        subscriptions: 2000,
        notifications: 100,
        ads: false,
        price: 5.99
    },
    pro: {
        name: 'Pro',
        subscriptions: 10000,
        notifications: 100,
        ads: false,
        price: 15.99
    },
    ultra: {
        name: 'Ultra',
        subscriptions: 'Ilimitado',
        notifications: 'Ilimitado',
        ads: false,
        price: 45.99
    },
}

export function getPlanDetail(plan: string) {
    plan = plan != 'undefined' ? plan : 'free';
    return Plans[plan];
}

export interface PlanDetail {
    name: string;
    subscriptions: any;
    notifications: any;
    ads: boolean;
    price: number;
}