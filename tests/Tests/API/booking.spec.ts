import { test, expect } from '@playwright/test';

type Booking = {
    firstname: string,
    lastname: string,
    totalprice: number,
    depositpaid: boolean,
    bookingdates: {
        checkin: string,
        checkout: string
    },
    additionalneeds: string
};

test.describe('Booking API tests', { tag: '@sanity' }, () => {

    const newBooking: Booking = {
        firstname: 'Adenike',
        lastname: 'Olapetan',
        totalprice: 250,
        depositpaid: true,
        bookingdates: {
            checkin: '2026-12-01',
            checkout: '2026-12-05'
        },
        additionalneeds: 'Breakfast'
    };

    test('Validate that a created booking can be fetched by id with matching fields', async ({ request }) => {
        const createResponse = await request.post('/booking', { data: newBooking });
        expect(createResponse.status()).toBe(200);
        const { bookingid } = await createResponse.json();
        expect(bookingid).toEqual(expect.any(Number));

        const getResponse = await request.get(`/booking/${bookingid}`);
        expect(getResponse.status()).toBe(200);

        // toEqual is a deep comparison, so every field (including nested dates) must match
        // and any missing or extra field fails the test
        expect(await getResponse.json()).toEqual(newBooking);
    });
});
