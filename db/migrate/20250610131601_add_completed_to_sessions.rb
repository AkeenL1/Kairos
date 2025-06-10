class AddCompletedToSessions < ActiveRecord::Migration[8.0]
  def change
    add_column :sessions, :completed, :boolean, default: false
  end
end
