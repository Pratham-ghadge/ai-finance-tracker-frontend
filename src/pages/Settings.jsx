import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Baby, GraduationCap, PiggyBank, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../utils/api';

const Settings = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        familyDetails: {
            membersCount: 1,
            hasChildren: false,
            childrenCount: 0,
            educationBudget: 0,
            savingsTarget: 0,
        },
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                familyDetails: {
                    membersCount: user.familyDetails?.membersCount || 1,
                    hasChildren: user.familyDetails?.hasChildren || false,
                    childrenCount: user.familyDetails?.childrenCount || 0,
                    educationBudget: user.familyDetails?.educationBudget || 0,
                    savingsTarget: user.familyDetails?.savingsTarget || 0,
                },
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const response = await userAPI.updateProfile(formData);
            setUser(response.data.user);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Update failed', error);
        } finally {
            setLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-8 pb-12">
            <header>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white">Account Settings</h1>
                <p className="text-slate-500 mt-2 text-lg">Manage your personal and family financial profile.</p>
            </header>

            {success && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl">
                    <CheckCircle2 size={20} />
                    <p className="font-semibold">Profile updated successfully!</p>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="panel space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-2xl">
                            <User size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Personal Information</h2>
                    </div>

                    <div className="grid gap-6">
                        <div className="field">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>
                    </div>
                </section>

                <section className="panel space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-2xl">
                            <Users size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Family Profile</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="field">
                            <label htmlFor="membersCount">Total Family Members</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="membersCount"
                                    name="familyDetails.membersCount"
                                    value={formData.familyDetails.membersCount}
                                    onChange={handleChange}
                                    className="input pl-12"
                                    min="1"
                                />
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-8">
                            <input
                                type="checkbox"
                                id="hasChildren"
                                name="familyDetails.hasChildren"
                                checked={formData.familyDetails.hasChildren}
                                onChange={handleChange}
                                className="w-5 h-5 rounded-lg text-cyan-600 focus:ring-cyan-500 border-slate-300"
                            />
                            <label htmlFor="hasChildren" className="font-semibold text-slate-700 dark:text-slate-300">I have children</label>
                        </div>

                        {formData.familyDetails.hasChildren && (
                            <div className="field">
                                <label htmlFor="childrenCount">Number of Children</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="childrenCount"
                                        name="familyDetails.childrenCount"
                                        value={formData.familyDetails.childrenCount}
                                        onChange={handleChange}
                                        className="input pl-12"
                                        min="0"
                                    />
                                    <Baby className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>
                        )}

                        <div className="field">
                            <label htmlFor="educationBudget">Monthly Education Budget (₹)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="educationBudget"
                                    name="familyDetails.educationBudget"
                                    value={formData.familyDetails.educationBudget}
                                    onChange={handleChange}
                                    className="input pl-12"
                                    min="0"
                                />
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                            <p className="text-xs text-slate-500">Planning for school/college fees and activities.</p>
                        </div>

                        <div className="field">
                            <label htmlFor="savingsTarget">Monthly Future Savings Target (₹)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="savingsTarget"
                                    name="familyDetails.savingsTarget"
                                    value={formData.familyDetails.savingsTarget}
                                    onChange={handleChange}
                                    className="input pl-12"
                                    min="0"
                                />
                                <PiggyBank className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                            <p className="text-xs text-slate-500">Goal for family retirement, house, or children's long-term future.</p>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary px-10 py-4 text-base"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default Settings;
