#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[derive(TopEncode, TopDecode, TypeAbi, Clone, PartialEq, Eq, Debug, ManagedVecItem)]
pub enum Role {
    Admin,
    Trader,
    Auditor,
    Oracle,
    AIAgent,
}

#[derive(TopEncode, TopDecode, TypeAbi, Clone, Debug, ManagedVecItem)]
pub struct AIDecision {
    pub action_hash: ManagedBuffer,
    pub confidence_score: u64, // 0-10000 (0-100.00%)
    pub risk_assessment: u64,  // 0-10000 (0-100.00%)
    pub ai_model_version: ManagedBuffer,
    pub timestamp: u64,
}

#[derive(TopEncode, TopDecode, TypeAbi, Clone, Debug, ManagedVecItem)]
pub struct SecurityAudit {
    pub contract_hash: ManagedBuffer,
    pub vulnerability_score: u64, // 0-10000 (0-100.00%)
    pub ai_analysis: ManagedBuffer,
    pub recommendations: ManagedBuffer,
    pub auditor: ManagedAddress,
    pub timestamp: u64,
}

#[multiversx_sc::contract]
pub trait AiPolicy {
    #[init]
    fn init(&self, oracle: ManagedAddress) {
        self.owner().set(self.blockchain().get_caller());
        self.oracle().set(oracle);
        self.ai_model_version().set(ManagedBuffer::from(b"GPZ-94-v1.0"));
        self.security_threshold().set(8000u64); // 80% confidence required
        self.max_risk_threshold().set(3000u64); // Max 30% risk
    }

    // ========== ENHANCED AI ROLE MANAGEMENT ==========
    
    #[endpoint(grantRole)]
    fn grant_role(&self, user: ManagedAddress, role: ManagedBuffer) {
        self.require_owner_or_oracle();
        self.user_roles(&user).insert(role);
    }
    
    #[endpoint(grantRoleWithAI)]
    fn grant_role_with_ai(
        &self,
        user: ManagedAddress,
        role: Role,
        ai_decision: AIDecision,
    ) {
        self.require_owner_or_oracle();
        
        // AI validation: require high confidence for sensitive roles
        let min_confidence = match role {
            Role::Admin => 9500u64,  // 95% confidence for admin
            Role::Oracle => 9000u64, // 90% confidence for oracle
            Role::AIAgent => 8500u64, // 85% confidence for AI agents
            _ => 7000u64,            // 70% confidence for others
        };
        
        require!(
            ai_decision.confidence_score >= min_confidence,
            "AI confidence too low for this role"
        );
        
        require!(
            ai_decision.risk_assessment <= self.max_risk_threshold().get(),
            "Risk assessment too high"
        );
        
        // Store role as buffer for compatibility
        let role_buffer = match role {
            Role::Admin => ManagedBuffer::from(b"admin"),
            Role::Trader => ManagedBuffer::from(b"trader"),
            Role::Auditor => ManagedBuffer::from(b"auditor"),
            Role::Oracle => ManagedBuffer::from(b"oracle"),
            Role::AIAgent => ManagedBuffer::from(b"ai_agent"),
        };
        
        self.user_roles(&user).insert(role_buffer.clone());
        self.ai_decisions(&user).push(&ai_decision);
        
        self.role_granted_ai_event(&user, &role_buffer, &ai_decision.confidence_score);
    }
    
    #[endpoint(revokeRole)]
    fn revoke_role(&self, user: ManagedAddress, role: ManagedBuffer) {
        self.require_owner_or_oracle();
        self.user_roles(&user).swap_remove(&role);
    }
    
    // ========== AI-ENHANCED ACTION EXECUTION ==========
    
    #[endpoint(executeAction)]
    fn execute_action(&self, role_required: ManagedBuffer, action: ManagedBuffer) {
        let caller = self.blockchain().get_caller();
        require!(
            self.user_roles(&caller).contains(&role_required),
            "missing required role"
        );
        self.action_executed(&caller, &role_required, &action);
    }
    
    #[endpoint(executeWithAIValidation)]
    fn execute_with_ai_validation(
        &self,
        action: ManagedBuffer,
        required_role: ManagedBuffer,
        ai_decision: AIDecision,
    ) {
        let caller = self.blockchain().get_caller();
        require!(
            self.user_roles(&caller).contains(&required_role),
            "missing required role"
        );
        
        // AI validation for critical actions
        require!(
            ai_decision.confidence_score >= self.security_threshold().get(),
            "AI confidence below security threshold"
        );
        
        require!(
            ai_decision.risk_assessment <= self.max_risk_threshold().get(),
            "Risk assessment too high for this action"
        );
        
        // Store AI decision for audit trail
        self.ai_audit_trail().push(&ai_decision);
        
        // Execute the validated action
        self.action_executed_ai_event(&caller, &action, &ai_decision.confidence_score);
    }
    
    // ========== AI SECURITY AUDITING ==========
    
    #[endpoint(submitSecurityAudit)]
    fn submit_security_audit(&self, audit: SecurityAudit) {
        let caller = self.blockchain().get_caller();
        require!(
            self.user_roles(&caller).contains(&ManagedBuffer::from(b"auditor")),
            "Only auditors can submit security audits"
        );
        
        // Auto-alert if AI detects high vulnerability
        if audit.vulnerability_score > 7000u64 {
            self.security_alert_event(&audit.contract_hash, &audit.vulnerability_score);
        }
        
        self.security_audits().push(&audit);
        self.audit_submitted_event(&audit.contract_hash, &audit.vulnerability_score);
    }
    
    #[endpoint(getAIRecommendations)]
    fn get_ai_recommendations(&self, contract_hash: ManagedBuffer) -> MultiValueEncoded<SecurityAudit> {
        let mut recommendations = MultiValueEncoded::new();
        
        for audit in self.security_audits().iter() {
            if audit.contract_hash == contract_hash {
                recommendations.push(audit.into());
            }
        }
        
        recommendations
    }
    
    // ========== ADAPTIVE AI PARAMETERS ==========
    
    #[endpoint(updateAIModel)]
    fn update_ai_model(&self, model_version: ManagedBuffer, new_threshold: u64, new_risk_threshold: u64) {
        self.require_owner_or_oracle();
        
        require!(
            new_threshold >= 5000u64 && new_threshold <= 10000u64,
            "Invalid security threshold range (50-100%)"
        );
        
        require!(
            new_risk_threshold >= 1000u64 && new_risk_threshold <= 5000u64,
            "Invalid risk threshold range (10-50%)"
        );
        
        self.ai_model_version().set(&model_version);
        self.security_threshold().set(new_threshold);
        self.max_risk_threshold().set(new_risk_threshold);
        
        self.ai_model_updated_event(&model_version, &new_threshold, &new_risk_threshold);
    }
    
    #[endpoint(setOracle)]
    #[only_owner]
    fn set_oracle(&self, new_oracle: ManagedAddress) {
        self.oracle().set(new_oracle);
    }
    
    // ========== VIEW FUNCTIONS ==========
    
    #[view(hasRole)]
    fn has_role(&self, user: ManagedAddress, role: ManagedBuffer) -> bool {
        self.user_roles(&user).contains(&role)
    }
    
    #[view(getAIMetrics)]
    fn get_ai_metrics(&self) -> MultiValue4<ManagedBuffer, u64, u64, u64> {
        let model_version = self.ai_model_version().get();
        let threshold = self.security_threshold().get();
        let total_decisions = self.ai_audit_trail().len();
        let total_audits = self.security_audits().len();
        
        (model_version, threshold, total_decisions as u64, total_audits as u64).into()
    }
    
    #[view(getSecurityThresholds)]
    fn get_security_thresholds(&self) -> MultiValue2<u64, u64> {
        let confidence_threshold = self.security_threshold().get();
        let risk_threshold = self.max_risk_threshold().get();
        
        (confidence_threshold, risk_threshold).into()
    }
    
    #[view(getUserAIHistory)]
    fn get_user_ai_history(&self, user: ManagedAddress) -> MultiValueEncoded<AIDecision> {
        let mut history = MultiValueEncoded::new();
        
        for decision in self.ai_decisions(&user).iter() {
            history.push(decision.into());
        }
        
        history
    }
    
    // ========== HELPER FUNCTIONS ==========
    
    fn require_owner_or_oracle(&self) {
        let caller = self.blockchain().get_caller();
        let is_owner = caller == self.owner().get();
        let is_oracle = caller == self.oracle().get();
        require!(is_owner || is_oracle, "only owner/oracle");
    }
    
    // ========== STORAGE MAPPERS ==========
    
    #[storage_mapper("owner")]
    fn owner(&self) -> SingleValueMapper<ManagedAddress>;
    
    #[storage_mapper("oracle")]
    fn oracle(&self) -> SingleValueMapper<ManagedAddress>;
    
    #[storage_mapper("user_roles")]
    fn user_roles(&self, user: &ManagedAddress) -> UnorderedSetMapper<ManagedBuffer>;
    
    #[storage_mapper("ai_decisions")]
    fn ai_decisions(&self, user: &ManagedAddress) -> VecMapper<AIDecision>;
    
    #[storage_mapper("ai_audit_trail")]
    fn ai_audit_trail(&self) -> VecMapper<AIDecision>;
    
    #[storage_mapper("security_audits")]
    fn security_audits(&self) -> VecMapper<SecurityAudit>;
    
    #[storage_mapper("ai_model_version")]
    fn ai_model_version(&self) -> SingleValueMapper<ManagedBuffer>;
    
    #[storage_mapper("security_threshold")]
    fn security_threshold(&self) -> SingleValueMapper<u64>;
    
    #[storage_mapper("max_risk_threshold")]
    fn max_risk_threshold(&self) -> SingleValueMapper<u64>;
    
    // ========== EVENTS ==========
    
    #[event("action_executed")]
    fn action_executed(
        &self,
        #[indexed] caller: &ManagedAddress,
        #[indexed] role: &ManagedBuffer,
        action: &ManagedBuffer,
    );
    
    #[event("role_granted_ai")]
    fn role_granted_ai_event(
        &self,
        #[indexed] user: &ManagedAddress,
        #[indexed] role: &ManagedBuffer,
        #[indexed] confidence: &u64,
    );
    
    #[event("action_executed_ai")]
    fn action_executed_ai_event(
        &self,
        #[indexed] user: &ManagedAddress,
        action: &ManagedBuffer,
        #[indexed] confidence: &u64,
    );
    
    #[event("security_alert")]
    fn security_alert_event(
        &self,
        #[indexed] contract_hash: &ManagedBuffer,
        #[indexed] vulnerability_score: &u64,
    );
    
    #[event("audit_submitted")]
    fn audit_submitted_event(
        &self,
        #[indexed] contract_hash: &ManagedBuffer,
        #[indexed] vulnerability_score: &u64,
    );
    
    #[event("ai_model_updated")]
    fn ai_model_updated_event(
        &self,
        #[indexed] model_version: &ManagedBuffer,
        #[indexed] confidence_threshold: &u64,
        #[indexed] risk_threshold: &u64,
    );
}