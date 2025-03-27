using Ecommerce.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Persistence
{
    public partial class EcommerceDbContext : DbContext
    {
        public EcommerceDbContext()
        {
        }

        public EcommerceDbContext(DbContextOptions<EcommerceDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Account> Accounts { get; set; }

        public virtual DbSet<Category> Categories { get; set; }

        public virtual DbSet<Order> Orders { get; set; }

        public virtual DbSet<OrderDetail> OrderDetails { get; set; }

        public virtual DbSet<Payment> Payments { get; set; }

        public virtual DbSet<Product> Products { get; set; }

        public virtual DbSet<Size> Sizes { get; set; }

        public virtual DbSet<TransactionStatus> TransactionStatus { get; set; }

        public virtual DbSet<CartItem> CartItems { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ProductReview> ProductReviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>(entity =>
            {
                entity.Property(e => e.ID).HasColumnName("ID");
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.Email).HasMaxLength(50);
                entity.Property(e => e.FullName).HasMaxLength(150);
                entity.Property(e => e.Password).HasMaxLength(50);
                entity.Property(e => e.Phone)
                    .HasMaxLength(10)
                    .IsUnicode(false);
                entity.Property(e => e.Role).HasColumnName("Role");
                entity.Property(e => e.Salt)
                    .HasMaxLength(10)
                    .IsFixedLength();
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.ID).HasName("PK_Types");

                entity.Property(e => e.ID).HasColumnName("ID");
                entity.Property(e => e.CategoryName).HasMaxLength(250);
                entity.Property(e => e.ParentID).HasColumnName("ParentID");
            });

            modelBuilder.Entity<Account>(entity =>
            {
                entity.Property(e => e.ID).HasColumnName("ID");
                entity.Property(e => e.Address).HasMaxLength(255);
                entity.Property(e => e.Avatar).HasMaxLength(255);
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
                entity.Property(e => e.Email).HasMaxLength(50);
                entity.Property(e => e.FullName).HasMaxLength(150);
                entity.Property(e => e.Password).HasMaxLength(255);
                entity.Property(e => e.Phone)
                    .HasMaxLength(10)
                    .IsUnicode(false);
                entity.Property(e => e.Salt)
                    .HasMaxLength(10)
                    .IsFixedLength();
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(e => e.ID).HasColumnName("ID");
                entity.Property(e => e.CustomerID).HasColumnName("CustomerID");
                entity.Property(e => e.OrderDate).HasColumnType("datetime");
                entity.Property(e => e.PaymentDate).HasColumnType("datetime");
                entity.Property(e => e.PaymentID).HasColumnName("PaymentID");
                entity.Property(e => e.ShipDate).HasColumnType("datetime");
                entity.Property(e => e.TransactionStatusID).HasColumnName("TransactStatusID");

                entity.HasOne(d => d.Customer).WithMany(p => p.Orders)
                    .HasForeignKey(d => d.CustomerID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Orders_Customers");

                entity.HasOne(d => d.Payment).WithMany(p => p.Orders)
                    .HasForeignKey(d => d.PaymentID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Orders_Payments");

                entity.HasOne(d => d.TransactionStatus).WithMany(p => p.Orders)
                    .HasForeignKey(d => d.TransactionStatusID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Orders_TransactionStatus");
            });

            modelBuilder.Entity<OrderDetail>(entity =>
            {
                entity.Property(e => e.ID).HasColumnName("ID");
                entity.Property(e => e.ImageUrl).HasMaxLength(255);
                entity.Property(e => e.OrderID).HasColumnName("OrderID");
                entity.Property(e => e.ProductID).HasColumnName("ProductID");
                entity.Property(e => e.ShipDate).HasColumnType("datetime");
                entity.Property(e => e.SizeName).HasMaxLength(3);

                entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails)
                    .HasForeignKey(d => d.OrderID)
                    .HasConstraintName("FK_OrderDetails_Orders");

                entity.HasOne(d => d.Product).WithMany(p => p.OrderDetails)
                    .HasForeignKey(d => d.ProductID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OrderDetails_Products");
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable("Payment");

                entity.Property(e => e.ID).HasColumnName("ID");
                entity.Property(e => e.PaymentName)
                    .HasMaxLength(50)
                    .HasColumnName("Payment");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(e => e.ID).HasColumnName("ID");
                entity.Property(e => e.CategoryID).HasColumnName("CatID");
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.ProductName).HasMaxLength(250);

                entity.HasOne(d => d.Category).WithMany(p => p.Products)
                    .HasForeignKey(d => d.CategoryID)
                    .HasConstraintName("FK_Products_Types");
            });

            modelBuilder.Entity<Size>(entity =>
            {
                entity.ToTable("Size");

                entity.Property(e => e.ID).HasColumnName("ID");
                entity.Property(e => e.SizeName)
                    .HasMaxLength(5)
                    .IsFixedLength();
            });

            modelBuilder.Entity<TransactionStatus>(entity =>
            {
                entity.ToTable("TransactStatus");

                entity.Property(e => e.ID).HasColumnName("ID");
                entity.Property(e => e.Description).HasMaxLength(250);
                entity.Property(e => e.Status).HasMaxLength(50);
            });

            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.ToTable("CartItems");
                entity.HasKey(ci => ci.ID); 
                entity.Property(ci => ci.Quantity).IsRequired();


                entity.HasOne(ci => ci.Customer)
                    .WithMany(c => c.CartItems) 
                    .HasForeignKey(ci => ci.CustomerID)
                    .OnDelete(DeleteBehavior.Cascade) 
                    .HasConstraintName("FK_CartItems_Account");


                entity.HasOne(ci => ci.Product)
                    .WithMany(p => p.CartItems) 
                    .HasForeignKey(ci => ci.ProductID)
                    .OnDelete(DeleteBehavior.Cascade) 
                    .HasConstraintName("FK_CartItems_Product");
                
                entity.HasOne(ci => ci.Size)
                    .WithMany(s => s.CartItems)
                    .HasForeignKey(ci => ci.SizeId)
                    .OnDelete(DeleteBehavior.NoAction)
                    .HasConstraintName("FK_CartItem_Size");

            });
            modelBuilder.Entity<ChatMessage>().ToTable("ChatMessages");
            modelBuilder.Entity<Conversation>()
                .HasOne(c => c.Admin)
                .WithMany()
                .HasForeignKey(c => c.AdminId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Conversation>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(m => m.Conversation)
                .WithMany()
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductReview>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FullName)
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(e => e.ReviewMessage)
                    .HasMaxLength(1000)
                    .IsRequired();

                entity.Property(e => e.ReviewNumber)
                    .IsRequired();

                entity.HasOne<Product>()
                    .WithMany()
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<Account>()
                    .WithMany()
                    .HasForeignKey(e => e.AccountId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
