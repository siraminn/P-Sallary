using Pajoohesh.Framework.Data.EF;
using Pajoohesh.Payment.Domain;

namespace Pajoohesh.Payment.Data
{
    public class PaymentDbContext : DataContext, IPaymentSqlContext
    {
        public PaymentDbContext(string connectionString) : base(connectionString)
        {
        }
    }
}
