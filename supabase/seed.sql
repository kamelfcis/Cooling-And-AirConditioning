-- ===================================================
-- SEED DATA FOR HVAC SERVICES
-- ===================================================

-- Insert sample services
-- base_price in EGP (Egyptian pound) for graduation business plan alignment
INSERT INTO public.services (code, name_en, name_ar, description_en, description_ar, base_price, is_active) VALUES
('AC_CLEAN', 'AC Cleaning', 'تنظيف المكيف', 'Complete cleaning of air conditioning units including filters, coils, and drainage system', 'تنظيف شامل لوحدات التكييف بما في ذلك الفلاتر والملفات ونظام الصرف', 500.00, true),
('AC_REPAIR', 'AC Repair', 'إصلاح المكيف', 'Diagnosis and repair of air conditioning unit issues', 'تشخيص وإصلاح مشاكل وحدة التكييف', 1000.00, true),
('AC_INSTALL', 'AC Installation', 'تركيب المكيف', 'Professional installation of new air conditioning units', 'تركيب احترافي لوحدات تكييف جديدة', 1500.00, true),
('AC_MAINTENANCE', 'AC Maintenance', 'صيانة المكيف', 'Regular maintenance service to ensure optimal performance', 'خدمة صيانة دورية لضمان الأداء الأمثل', 750.00, true),
('AC_GAS_REFILL', 'Gas Refill', 'شحن الغاز', 'Refilling refrigerant gas in air conditioning units', 'إعادة شحن غاز التبريد في وحدات التكييف', 800.00, true),
('AC_ELECTRICAL', 'Electrical Repair', 'إصلاح كهربائي', 'Repair of electrical components and wiring', 'إصلاح المكونات الكهربائية والأسلاك', 900.00, true);

