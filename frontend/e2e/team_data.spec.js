import { test, expect } from '@playwright/test';
import teamData from '../public/team.json' assert { type: 'json' };

test.describe('team.json data structure and content', () => {
    
    test('should be a non-empty array', async ({}) => {
        expect(Array.isArray(teamData)).toBe(true);
        expect(teamData.length).toBeGreaterThan(0);
    });

    teamData.forEach((member, index) => {
        test.describe(`Member at index ${index} (${member.name || 'Unknown'})`, () => {
            test('should have all required fields', async ({}) => {
                expect(member).toHaveProperty('name');
                expect(member).toHaveProperty('role');
                expect(member).toHaveProperty('profilePicture');
                expect(member).toHaveProperty('linkedinUrl');
                expect(member).toHaveProperty('active');
            });

            test('should have correct data types', async ({}) => {
                expect(typeof member.name).toBe('string');
                expect(typeof member.role).toBe('string');
                expect(typeof member.profilePicture).toBe('string');
                expect(typeof member.linkedinUrl).toBe('string');
                expect(typeof member.active).toBe('boolean');
            });

            test('name should not contain a comma (Last, First format)', async ({}) => {
                expect(member.name).not.toContain(',');
            });

            test('profilePicture path should start with /img/', async ({}) => {
                expect(member.profilePicture).toMatch(/^\/img\//);
            });

            test('linkedinUrl should be a valid LinkedIn URL', async ({}) => {
                expect(member.linkedinUrl).toMatch(/^https?:\/\/(www\.)?linkedin\.com\/in\//);
            });

            test('role should be one of the expected values', async ({}) => {
                const allowedRoles = ["Tester", "Business Analyst", "Business Analyst & Product Owner", "Manager"];
                expect(allowedRoles).toContain(member.role);
            });
        });
    });

    test('all member names should be unique', async ({}) => {
        const names = teamData.map(member => member.name);
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(names.length);
    });

    test('should be sorted correctly by role and then by first name', async ({}) => {
        const sortedData = [...teamData].sort((a, b) => {
            const roleOrder = {
                "Tester": 1,
                "Business Analyst": 2,
                "Business Analyst & Product Owner": 2,
                "Manager": 3
            };

            const roleA = roleOrder[a.role] || 99;
            const roleB = roleOrder[b.role] || 99;

            if (roleA !== roleB) {
                return roleA - roleB;
            }

            const firstNameA = a.name.split(' ')[0];
            const firstNameB = b.name.split(' ')[0];
            return firstNameA.localeCompare(firstNameB);
        });
        expect(teamData).toEqual(sortedData);
    });
});