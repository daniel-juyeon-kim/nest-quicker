export interface ILocationRepository {
  findDestinationDepartureByOrderId(orderId: number): Promise<{
    id: number;
    departure: { x: number; y: number };
    destination: { x: number; y: number };
  }>;
  findAllDestinationDepartureByOrderIds(orderIds: number[]): Promise<
    {
      id: number;
      departure: { x: number; y: number };
      destination: { x: number; y: number };
    }[]
  >;
}
