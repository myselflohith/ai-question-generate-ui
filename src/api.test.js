import { fetchYears, fetchSubjects, fetchChapters, yearsResponse, subjectsResponse, chaptersResponse } from './api';

test('fetchYears returns PUC years', async () => {
  await expect(fetchYears()).resolves.toEqual(yearsResponse);
});

test('fetchSubjects returns subjects list', async () => {
  await expect(fetchSubjects()).resolves.toEqual(subjectsResponse);
});

test('fetchChapters returns chapters list', async () => {
  await expect(fetchChapters()).resolves.toEqual(chaptersResponse);
});
