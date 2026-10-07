import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';
import UserProfile from '.';

const template = {};
vi.mock('@dsplay/react-template-utils', () => ({
  useTemplateVal: (key, fallback) => template[key] || fallback,
  useTemplateBoolVal: (_key, fallback) => fallback,
}));

const instagram = { name: 'Instagram Name', username: 'brand', pic: 'https://cdn.example/ig.jpg' };

function renderWith(values) {
  Object.keys(template).forEach((key) => delete template[key]);
  Object.assign(template, values);
  const { container } = render(<UserProfile {...instagram} />);
  return {
    name: container.querySelector('.user-name').textContent,
    pic: container.querySelector('.user-picture').style.backgroundImage,
  };
}

describe('UserProfile', () => {
  afterEach(cleanup);

  it("shows the account's Instagram name and picture when no override is set", () => {
    expect(renderWith({})).toEqual({ name: 'Instagram Name', pic: 'url("https://cdn.example/ig.jpg")' });
  });

  it('uses the template values as overrides when filled in', () => {
    expect(renderWith({ user_screen_name: 'Custom Name', profile_picture: 'https://cdn.example/custom.png' }))
      .toEqual({ name: 'Custom Name', pic: 'url("https://cdn.example/custom.png")' });
  });

  it('overrides only the field that was filled in', () => {
    expect(renderWith({ user_screen_name: 'Custom Name' })).toEqual({ name: 'Custom Name', pic: 'url("https://cdn.example/ig.jpg")' });
  });
});
