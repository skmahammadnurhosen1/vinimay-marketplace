import { VEHICLE_MANUFACTURERS, POPULAR_VEHICLE_BRANDS } from '../data/vehicles';
import { POPULAR_PRODUCTS } from '../data/products';
import { Manufacturer, VehicleModel, SelectedVehicle, VehicleBrand, VehicleCategoryType } from '../types';

export interface IVehicleService {
  getManufacturers(category?: VehicleCategoryType): Promise<Manufacturer[]>;
  getModels(manufacturerId: string): Promise<VehicleModel[]>;
  getModelById(manufacturerId: string, modelId: string): Promise<VehicleModel | undefined>;
  getPopularBrands(): Promise<VehicleBrand[]>;
  isPartCompatible(productId: string, vehicle: SelectedVehicle): Promise<boolean>;
}

class MockVehicleService implements IVehicleService {
  async getManufacturers(category?: VehicleCategoryType): Promise<Manufacturer[]> {
    if (!category) return VEHICLE_MANUFACTURERS;
    return VEHICLE_MANUFACTURERS.filter(m => m.category === category);
  }

  async getModels(manufacturerId: string): Promise<VehicleModel[]> {
    const manufacturer = VEHICLE_MANUFACTURERS.find(m => m.id === manufacturerId || m.name.toLowerCase().includes(manufacturerId.toLowerCase()));
    return manufacturer ? manufacturer.models : [];
  }

  async getModelById(manufacturerId: string, modelId: string): Promise<VehicleModel | undefined> {
    const manufacturer = VEHICLE_MANUFACTURERS.find(m => m.id === manufacturerId);
    if (!manufacturer) return undefined;
    return manufacturer.models.find(m => m.id === modelId || m.name.toLowerCase() === modelId.toLowerCase());
  }

  async getPopularBrands(): Promise<VehicleBrand[]> {
    return POPULAR_VEHICLE_BRANDS;
  }

  async isPartCompatible(productId: string, vehicle: SelectedVehicle): Promise<boolean> {
    const product = POPULAR_PRODUCTS.find(p => p.id === productId);
    if (!product || !vehicle) return false;

    // Check compatibility entries against selected vehicle
    return product.compatibility.some(c => {
      const matchMake = c.manufacturer.toLowerCase().includes(vehicle.manufacturer.toLowerCase()) ||
                        vehicle.manufacturer.toLowerCase().includes(c.manufacturer.toLowerCase());
      const matchModel = c.model.toLowerCase().includes(vehicle.model.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(c.model.toLowerCase());
      return matchMake && matchModel;
    });
  }
}

export const vehicleService = new MockVehicleService();
