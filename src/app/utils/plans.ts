export const Plans: any = {
    free: {
        subscriptions: 10,
        notifications: 10,
        ads: true,
        price: 0
    },
    plus: {
        subscriptions: 2000,
        notifications: 100,
        ads: false,
        price: 5.99
    },
    pro: {
        subscriptions: 10000,
        notifications: 100,
        ads: false,
        price: 15.99
    },
    ultra: {
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
    subscriptions: any;
    notifications: any;
    ads: boolean;
    price: number;
}