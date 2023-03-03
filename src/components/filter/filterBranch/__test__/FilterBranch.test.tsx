import renderer from 'react-test-renderer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FilterBranch from '../FilterBranch';

jest.mock('axios');
jest.mock('@formkit/auto-animate/react');
jest.mock('hooks/usePlatform');

const items = [
  {
    chain_name: "Adam's Kitchen",
    chain_id: 82369,
    vendor_id: '126601',
    vendor_name: "Adam's Kitchen",
    is_active: true,
    platform: 'deliveroo',
    access_token: '',
    access_token_bis: null,
    data: {
      vendor_id: '126601',
      chain_id: 82369,
      data: {
        vendor_name: "Adam's Kitchen",
        chain_name: "Adam's Kitchen",
      },
      metadata: {
        cost: '0.15',
        drn_id: '79781475-****-****-****-****07b',
        org_id: '0e35a3d3-****-****-****-****a24',
        is_active: true,
        is_deleted: false,
      },
    },
  },
];

test('Should render Branch Filter', () => {
  const queryClient = new QueryClient();

  const mockOnchange = jest.fn();

  const component = renderer.create(
    <QueryClientProvider client={queryClient}>
      <FilterBranch label='test' values={['value1']} onChange={mockOnchange} items={items} />
    </QueryClientProvider>
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
