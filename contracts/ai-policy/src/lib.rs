#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait AiPolicy {
    #[init]
    fn init(&self, oracle: ManagedAddress) {
        self.owner().set(self.blockchain().get_caller());
        self.oracle().set(oracle);
    }

    // Owner/Oracle management
    #[only_owner]
    #[endpoint(setOracle)]
    fn set_oracle(&self, new_oracle: ManagedAddress) {
        self.oracle().set(new_oracle);
    }

    // Core: AI-enhanced via off-chain oracle translating NL -> structured calls
    // grantRole/revokeRole: callable by owner or oracle
    #[endpoint(grantRole)]
    fn grant_role(&self, user: ManagedAddress, role: ManagedBuffer) {
        self.require_owner_or_oracle();
        self.user_roles(&user).insert(role);
    }

    #[endpoint(revokeRole)]
    fn revoke_role(&self, user: ManagedAddress, role: ManagedBuffer) {
        self.require_owner_or_oracle();
        self.user_roles(&user).swap_remove(&role);
    }

    // Example action gate: requires role
    // action is a free-form buffer; client can structure it (e.g., JSON or TLV)
    #[endpoint(executeAction)]
    fn execute_action(&self, role_required: ManagedBuffer, action: ManagedBuffer) {
        let caller = self.blockchain().get_caller();
        require!(
            self.user_roles(&caller).contains(&role_required),
            "missing required role"
        );
        // For MVP we just emit event; extend to call other contracts/logic
        self.action_executed(&caller, &role_required, &action);
    }

    // Views
    #[view(hasRole)]
    fn has_role(&self, user: ManagedAddress, role: ManagedBuffer) -> bool {
        self.user_roles(&user).contains(&role)
    }

    // Helpers
    fn require_owner_or_oracle(&self) {
        let caller = self.blockchain().get_caller();
        let is_owner = caller == self.owner().get();
        let is_oracle = caller == self.oracle().get();
        require!(is_owner || is_oracle, "only owner/oracle");
    }

    // Storage
    #[storage_mapper("owner")]
    fn owner(&self) -> SingleValueMapper<ManagedAddress>;

    #[storage_mapper("oracle")]
    fn oracle(&self) -> SingleValueMapper<ManagedAddress>;

    #[storage_mapper("user_roles")]
    fn user_roles(&self, user: &ManagedAddress) -> UnorderedSetMapper<ManagedBuffer>;

    // Events
    #[event("action_executed")]
    fn action_executed(
        &self,
        #[indexed] caller: &ManagedAddress,
        #[indexed] role: &ManagedBuffer,
        action: &ManagedBuffer,
    );
}