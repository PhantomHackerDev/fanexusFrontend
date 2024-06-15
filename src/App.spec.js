import { mount, createLocalVue } from '@vue/test-utils';
import App from '@/App';
import VueRouter from 'vue-router';
import router from '@/router/index';
import store from '@/store';
import { apiInit } from '~api';

import { LAYOUTS } from '@/services/layout.service';
import DefaultLayout from '@/layouts/Default';
import PureLayout from '@/layouts/Pure';

const { DEFAULT, PURE } = LAYOUTS;

const localVue = createLocalVue();
localVue.use(VueRouter);

localVue.component(DEFAULT, DefaultLayout);
localVue.component(PURE, PureLayout);

apiInit();

describe('App', () => {
  it('has a find by tag field', async () => {
    router.push({ name: 'home' });
    const wrapper = mount(App, {
      localVue,
      router,
      store
    });
    const findByTagButton = wrapper.find(
      '.header-navigation__tags-find-button'
    );
    await findByTagButton.trigger('click');
    expect(router.currentRoute.name).toBe('tagged-blog-posts');
  });
});
