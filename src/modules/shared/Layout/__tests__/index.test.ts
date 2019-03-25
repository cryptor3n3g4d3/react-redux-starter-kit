import { makeShallowRenderer } from 'shared/helpers';
import { makeMockEntry, makeMockContainer, withRouterProps } from 'shared/mocks';

import { Layout, ILayoutProps } from '../Layout';
import routes from '../../../routes';

const props: ILayoutProps = {
  title: 'Title',
  profileFeatureEntry: makeMockEntry({
    ProfilePreview: makeMockContainer('ProfilePreview'),
  }),
  ...withRouterProps,
};

const getComponent = makeShallowRenderer(Layout, props);

describe('(modules/shared) Layout component', () => {
  it('should redirect to profile page on edit profile click', () => {
    const component = getComponent();
    const { ProfilePreview } = props.profileFeatureEntry.containers;
    component.find(ProfilePreview).prop('onEditClick')();
    expect(props.history.push).toHaveBeenCalledWith(routes.profile.getRoutePath());
  });
});