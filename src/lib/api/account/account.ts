import api from "../axios";

// Types
export interface PlanFeature {
  id: number;
  name: string;
  description: string;
  display_order: number;
}

export interface Plan {
  id: number;
  name: string;
  description: string;
  tagline: string;
  price: string;
  price_currency: string;
  max_reviews_per_month: number;
  max_locations: number;
  is_active: boolean;
  features: PlanFeature[];
}

export interface CurrentPlanDetails {
  id: number;
  name: string;
  price: string;
  description: string;
}

export interface AccountSettings {
  id: number;
  username: string;
  email: string;
  language_preference: string;
  is_email_verified: boolean;
  current_plan: CurrentPlanDetails;
}

export interface UserPlanDetails {
  id: number;
  user: number;
  username: string;
  plan: number;
  plan_details: Plan;
  activated_at: string;
}

export interface UpdateAccountData {
  language_preference?: string;
}

export interface UpgradePlanData {
  plan_id: number;
  payment_method?: string;
  payment_token?: string;
}

export interface UpgradePlanResponse {
  message: string;
  plan: UserPlanDetails;
  payment_status: string;
}

// API Functions
export const accountApi = {
  /**
   * Get current user's account settings
   */
  getAccountSettings: async (): Promise<AccountSettings> => {
    const response = await api.get("/account/me/");
    return response.data;
  },

  /**
   * Update account settings (e.g., language preference)
   */
  updateAccountSettings: async (
    data: UpdateAccountData
  ): Promise<AccountSettings> => {
    const response = await api.patch("/account/me/", data);
    return response.data;
  },

  /**
   * Get all available plans
   */
  getAvailablePlans: async (): Promise<Plan[]> => {
    const response = await api.get("/plan/available/");
    return response.data;
  },

  /**
   * Get current user's plan with details
   */
  getCurrentPlan: async (): Promise<UserPlanDetails> => {
    const response = await api.get("/plan/current/");
    return response.data;
  },

  /**
   * Upgrade to a new plan
   */
  upgradePlan: async (data: UpgradePlanData): Promise<UpgradePlanResponse> => {
    const response = await api.post("/plan/upgrade/", data);
    return response.data;
  },
};
